const fs = require("fs");
const { execSync } = require("child_process");
const express = require("express");
const app = express();
const port = 8199;

app.get("/status", (req, res) => {
  res.json({
    message: "Node service is running!",
    uptime: getUptime(),
    freeDisk: getFreeDisk()
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Node service listening on port ${port}`);
});

function getUptime() {
  const uptimeSeconds = parseFloat(fs.readFileSync("/proc/uptime", "utf8").split(" ")[0]);
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function getFreeDisk() {
  const output = execSync("df -m / | tail -1 | awk '{print $4}'").toString().trim();
  return `${output} MB`;
}
