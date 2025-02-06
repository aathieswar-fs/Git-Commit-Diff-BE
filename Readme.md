# GitDiff Viewer Backend

This is an Express.js-based backend that provides REST API endpoints for fetching commit details and diffs from the GitHub API. The backend serves as an intermediary between the frontend and GitHub's API.

## Features
- Fetch commit details including author, committer, message, and parent commits.
- Retrieve file diffs between commit changes.
- CORS enabled for frontend communication.

## Technologies Used
- Node.js
- Express.js
- Axios

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aathieswar-fs/Git-Commit-Diff-BE
   cd Git-Commit-Diff-BE
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the project root and add the following:
   ```sh
   PORT=5000
   ```

## Running the Application

Start the server:
   ```sh
   node app-rest.js
   ```

The backend will be running at `http://localhost:5000/`.

## API Endpoints

### Get Commit Details
```
GET /repositories/:owner/:repository/commits/:oid
```
#### Example:
```
http://localhost:5000/repositories/octocat/Hello-World/commits/1234567
```

### Get Commit Diff
```
GET /repositories/:owner/:repository/commits/:oid/diff
```
#### Example:
```
http://localhost:5000/repositories/octocat/Hello-World/commits/1234567/diff
```
