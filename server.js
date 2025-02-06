const express = require("express");
const cors = require("cors");
require("dotenv").config();

const commitRoutes = require("./routes/commitRoutes");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Use routes
app.use("/", commitRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
