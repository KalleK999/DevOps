const fs = require("fs");
const { execSync } = require("child_process");
const express = require("express");
const axios = require("axios");
const app = express();
const port = 8199;

app.get("/status", async (req, res) => {
  try {
    const response = await axios.post("http://service2:5000/receive", {
      from: "node-service",
      info: "Hello Python!"
    });

    res.json({
      message: "Sent message to service2",
      service1_uptime: getUptime(),
      service1_freedisk: getFreeDisk(),
      service2_response: response.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
