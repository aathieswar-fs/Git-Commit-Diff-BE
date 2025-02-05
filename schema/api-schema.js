const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Author {
    name: String
    date: String
    email: String
  }

  type Parent {
    oid: String
  }

  type HunkLine {
    baseLineNumber: Int
    headLineNumber: Int
    content: String
  }

  type Hunk {
    header: String
    lines: [HunkLine]
  }

  type FileDiff {
    changeKind: String
    headFile: FileInfo
    baseFile: FileInfo
    hunks: [Hunk]
  }

  type FileInfo {
    path: String
  }

  type Commit {
    oid: String
    message: String
    author: Author
    committer: Author
    parents: [Parent]
  }

  type Query {
    getCommit(owner: String!, repository: String!, oid: String!): Commit
    getDiff(owner: String!, repository: String!, oid: String!): [FileDiff]
  }
`);

module.exports = { schema };