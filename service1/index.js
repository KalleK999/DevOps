const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const express = require("express");
const axios = require("axios");
const app = express();
const port = 8199;

function getUptime() {
  const uptimeSeconds = parseFloat(fs.readFileSync("/proc/uptime", "utf8").split(" ")[0]);
  const hours = Math.floor(uptimeSeconds / 3600);
  return `${hours} hours`;
}

function getFreeDisk() {
  const output = execSync("df -m / | tail -1 | awk '{print $4}'").toString().trim();
  return `${output} MBytes`;
}

const data_dir = "/data";
if (!fs.existsSync(data_dir)) {
  fs.mkdirSync(data_dir, { recursive: true });
}

app.get("/status", async (req, res) => {
  const time = new Date();
  const msg = `${time.toISOString()}: uptime  ${getUptime()}, free disk in root: ${getFreeDisk()}\n`
  const fileName = path.join(data_dir, "status_log.txt");
  fs.appendFileSync(fileName, msg);
  try {
    await axios.post("http://storage:6000/status", 
      msg, { headers: { "Content-Type": "text/plain" } }
    );
  } catch (err) {
    res.status(500).send("Failed to store service1 status in storage: " + err.message);
  }
  try {
    const response = await axios.post("http://service2:5000/status", 
      msg, { headers: { "Content-Type": "text/plain" } }
    );
    res.send(`service1 sent text: "${msg}"service2 replied: ${response.data}`);
  } catch (err) {
    res.status(500).send("Failed to fetch status from service2: " + err.message);
  }
});

app.get("/log", async (req, res) => {
  try {
    const log_response = await axios.get("http://storage:6000/log");
    res.set("Content-Type", "text/plain");
    res.send(log_response.data);
  } catch (err) {
    res.status(500).send("Failed to fetch logs from storage: " + err.message);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Node service listening on port ${port}`);
});

