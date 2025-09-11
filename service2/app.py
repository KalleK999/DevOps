import os
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/status", methods=["GET"])
def status():
    return jsonify({"service": "service2", "status": "ok"})

@app.route("/receive", methods=["POST"])
def receive():
    return jsonify({
        "service2_uptime": get_uptime(),
        "service2_free_disk": get_free_disk()
    })


def get_uptime():
    with open("/proc/uptime", "r") as f:
        uptime_seconds = float(f.readline().split()[0])
        hours = int(uptime_seconds // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        return f"{hours}h {minutes}m"

def get_free_disk():
    st = os.statvfs("/")
    free_mb = (st.f_bavail * st.f_frsize) // (1024 * 1024)
    return f"{free_mb} MB"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
