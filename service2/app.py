import os
import requests
import datetime
from flask import Flask, Response

app = Flask(__name__)

data_dir = "/data"
os.makedirs(data_dir, exist_ok=True)

@app.route("/status", methods=["POST"])
def status():
    msg = f"{datetime.datetime.now().isoformat()}: uptime {get_uptime()}, free disk in root: {get_free_disk()}\n"
    fileName = os.path.join(data_dir, "status_log.txt")
    with open(fileName, "a") as f:
        f.write(msg)
    requests.post("http://storage:6000/status", msg, headers={"Content-Type": "text/plain"})
    return Response(msg, mimetype="text/plain")


def get_uptime():
    with open("/proc/uptime", "r") as f:
        uptime_seconds = float(f.readline().split()[0])
        hours = int(uptime_seconds // 3600)
        return f"{hours} hours"

def get_free_disk():
    st = os.statvfs("/")
    free_mb = (st.f_bavail * st.f_frsize) // (1024 * 1024)
    return f"{free_mb} MBytes"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
