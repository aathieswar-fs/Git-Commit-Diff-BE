# Solution Overview

## Approach & Architectural Decisions

This project consists of a backend built with Express.js and a frontend developed using React (Vite). The backend acts as an intermediary between the frontend and the GitHub API, providing commit details and diffs in a structured format.

### Technology Choices:
- **Node.js & Express.js:** Used for building a lightweight REST API to interact with GitHub.
- **Axios:** Chosen for making HTTP requests to the GitHub API due to its simplicity and error-handling capabilities.
- **CORS Middleware:** Ensures smooth communication between the frontend and backend.
- **React with Vite:** Vite was selected over Create React App for its superior performance, faster build times, and modern development experience.

### Intentional Deviations:
- The backend does not store any data; it directly proxies requests to the GitHub API. This eliminates the need for a database, reducing complexity.
- The diff parsing is handled manually instead of using a library like `diff` to ensure complete control over formatting and structure.
- All the UI is made manually for better control over the UI components

## Known Limitations & Trade-offs

### GitHub API Rate Limits:
- Since the API is unauthenticated, it is subject to GitHub's strict rate limits. Using an authenticated token would improve reliability.

### Performance Considerations:
- Currently, the backend fetches data on every request instead of caching results. Caching would improve response times and reduce API calls.

### UI Enhancements:
- The current frontend displays commit diffs, but a more advanced visualization (e.g., syntax highlighting or inline changes) could improve usability.

## Future Improvements

1. **Authentication & Authorization:**
   - Add GitHub authentication token to support user-based API calls, improving rate limits and security.
   
2. **Caching Mechanism:**
   - Implement an in-memory cache to store recent commit data and diffs, reducing repeated API calls and improving speed.
   
3. **Better Error Handling:**
   - Improve error messages and display them in the frontend for a smoother user experience.
   
4. **Enhanced UI & UX:**
   - Improve commit history navigation.
   - Optimize layout for better readability on different screen sizes.

## Repository Links
- **Frontend Repository:** https://github.com/AathiEswar/Git-Commit-Diff-FE
- **Backend Repository:** https://github.com/AathiEswar/Git-Commit-Diff-BE

