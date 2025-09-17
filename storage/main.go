package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func main() {
	dataDir := "/data"
	os.MkdirAll(dataDir, 0755)
	logFile := fmt.Sprintf("%s/status_log.txt", dataDir)

	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		f, err := os.OpenFile(logFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			http.Error(w, "Failed to open file", http.StatusInternalServerError)
			return
		}
		defer f.Close()

		line := fmt.Sprintf("%s: %s", time.Now().Format(time.RFC3339), string(body))
		if _, err := f.WriteString(line); err != nil {
			http.Error(w, "Failed to write file", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("Stored message successfully\n"))
	})

	http.HandleFunc("/log", func(w http.ResponseWriter, r *http.Request) {
		content, err := os.ReadFile(logFile)
		if err != nil {
			if os.IsNotExist(err) {
				w.Header().Set("Content-Type", "text/plain")
				w.Write([]byte("(no logs yet)\n"))
				return
			}
			http.Error(w, "Failed to read log file", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		w.Write(content)
	})

	fmt.Println("Go service listening on :6000")
	http.ListenAndServe(":6000", nil)
}
