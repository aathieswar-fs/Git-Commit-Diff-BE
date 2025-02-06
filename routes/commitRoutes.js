const express = require("express");
const { getCommitDetails, getCommitDiff } = require("../controllers/commitController");

const router = express.Router();

// Define routes
router.get("/repositories/:owner/:repository/commits/:oid", getCommitDetails);
router.get("/repositories/:owner/:repository/commits/:oid/diff", getCommitDiff);

module.exports = router;
