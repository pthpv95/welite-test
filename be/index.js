const express = require("express");
const processLogsFile = require("./process-logs");
const app = express();
const fs = require("fs");

app.get("/api/book", function (req, res) {
  processLogsFile();
  const logsFile = fs.readFileSync("logs.json", "utf8");
  res.send(JSON.parse(logsFile));
});

app.listen(3030);
