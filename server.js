require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// Import routes
const mpesaRoutes = require("./routes/mpesa");
app.use("/mpesa", mpesaRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
