const { graphqlHTTP } = require('express-graphql');

const axios = require('axios');
require("dotenv").config();
const {schema} = require("./schema/api-schema")

const app = express();
const PORT = process.env.PORT || 5000;

// Resolver
const root = {
  getCommit: async ({ owner, repository, oid }) => {
    const GITHUB_API_URL = `https://api.github.com/repos/${owner}/${repository}/commits/${oid}`;

    try {
      const response = await axios.get(GITHUB_API_URL);
      const commitData = response.data;

      return {
        oid: commitData.sha,
        message: commitData.commit.message,
        author: {
          name: commitData.commit.author.name,
          date: commitData.commit.author.date,
          email: commitData.commit.author.email
        },
        committer: {
          name: commitData.commit.committer.name,
          date: commitData.commit.committer.date,
          email: commitData.commit.committer.email
        },
        parents: commitData.parents.map(parent => ({
          oid: parent.sha
        }))
      };
    } catch (error) {
      throw new Error("Failed to fetch commit details from GitHub API");
    }
  },

  getDiff: async ({ owner, repository, oid }) => {
    const COMMIT_API_URL = `https://api.github.com/repos/${owner}/${repository}/commits/${oid}`;

    try {
      // Get Parent Commit SHA
      const commitResponse = await axios.get(COMMIT_API_URL);
      const parentOid = commitResponse.data.parents[0]?.sha;
      if (!parentOid) {
        throw new Error("No parent commit found");
      }

      // Get Diff Between Parent and Current Commit
      const DIFF_API_URL = `https://api.github.com/repos/${owner}/${repository}/compare/${parentOid}...${oid}`;
      const diffResponse = await axios.get(DIFF_API_URL);
      const filesChanged = diffResponse.data.files;

      // Format Data
      return filesChanged.map(file => ({
        changeKind: file.status.toUpperCase(),
        headFile: { path: file.filename },
        baseFile: { path: file.filename },
        hunks: parsePatch(file.patch)
      }));
    } catch (error) {
      throw new Error("Failed to fetch diff data from GitHub API");
    }
  }
};

// Parse diff patch
const parsePatch = (patch) => {
  if (!patch) return [];

  const lines = patch.split("\n");
  const hunks = [];
  let currentHunk = null;
  let baseLine = 0;
  let headLine = 0;

  lines.forEach((line) => {
    // Detect start of a hunk
    const hunkHeaderMatch = line.match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
    if (hunkHeaderMatch) {
      if (currentHunk) hunks.push(currentHunk);

      // Extract line numbers
      baseLine = parseInt(hunkHeaderMatch[1], 10); 
      headLine = parseInt(hunkHeaderMatch[3], 10); 

      currentHunk = {
        header: line,
        lines: []
      };
    } else if (currentHunk) {
      let baseNum = null;
      let headNum = null;

      if (line.startsWith("-")) {
        baseNum = baseLine++;
      } else if (line.startsWith("+")) {
        headNum = headLine++;
      } else {
        baseNum = baseLine++;
        headNum = headLine++;
      }

      currentHunk.lines.push({
        baseLineNumber: baseNum,
        headLineNumber: headNum,
        content: line
      });
    }
  });

  if (currentHunk) hunks.push(currentHunk);
  return hunks;
};


// Initialize GraphQL Middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Express route to fetch commit
app.get('/repositories/:owner/:repository/commits/:oid', async (req, res) => {
  const { owner, repository, oid } = req.params;

  try {
    const query = `
      query {
        getCommit(owner: "${owner}", repository: "${repository}", oid: "${oid}") {
          oid
          message
          author {
            name
            date
            email
          }
          committer {
            name
            date
            email
          }
          parents {
            oid
          }
        }
      }
    `;

    const response = await axios.post(`http://localhost:${PORT}/graphql`, { query }, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response.data.data.getCommit, null, 2));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commit data" });
  }
});

// Express route to fetch commit diff
app.get('/repositories/:owner/:repository/commits/:oid/diff', async (req, res) => {
  const { owner, repository, oid } = req.params;

  try {
    const query = `
      query {
        getDiff(owner: "${owner}", repository: "${repository}", oid: "${oid}") {
          changeKind
          headFile {
            path
          }
          baseFile {
            path
          }
          hunks {
            header
            lines {
              baseLineNumber
              headLineNumber
              content
            }
          }
        }
      }
    `;

    const response = await axios.post(`http://localhost:${PORT}/graphql`, { query }, {
      headers: { 'Content-Type': 'application/json'  }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response.data.data.getDiff, null, 2));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commit diff data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at PORT : ${process.env.PORT}`);
});
