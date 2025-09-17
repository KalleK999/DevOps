FROM python:3.12-slim

WORKDIR /app

RUN pip install flask
RUN pip install requests

COPY app.py .

CMD ["python", "app.py"]
