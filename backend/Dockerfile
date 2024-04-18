FROM golang:1.21-alpine as builder
RUN apk add build-base
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main     ./cmd/*go

FROM alpine:latest
RUN apk add ca-certificates multirun
WORKDIR /app
COPY --from=builder /app/. ./
EXPOSE 3030

