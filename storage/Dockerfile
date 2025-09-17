FROM golang:1.22 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server .

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=build /app/server .

EXPOSE 6000
CMD ["./server"]

