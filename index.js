const express = require("express");
const database = require("./config/database");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();

const routerApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

app.use(cors());

database.connect();

// parse application/json
app.use(bodyParser.json());

// ROUTER API VER 1
routerApiVer1(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
