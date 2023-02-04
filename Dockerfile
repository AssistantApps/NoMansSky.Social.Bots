FROM node:19.0.0-bullseye-slim as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs18-debian11

COPY build .
COPY --from=builder /usr/src/app/node_modules /node_modules

CMD ["./index.js" ]