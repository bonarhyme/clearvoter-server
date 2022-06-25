const express = require("express");
const app = express();
require("dotenv/config");
require("./config/db")();

const PORT = process.env.PORT || 5020;
app.listen(PORT, () => console.log("Server running on PORT " + PORT));
