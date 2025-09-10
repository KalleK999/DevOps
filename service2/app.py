import os

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
    print("=== Container Info (Python) ===")
    print("Uptime:", get_uptime())
    print("Free disk in /:", get_free_disk())
