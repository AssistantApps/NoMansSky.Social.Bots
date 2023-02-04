FROM node:19.0.0-bullseye-slim as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# COPY package*.json ./
# COPY tsconfig.json ./tsconfig.json
# COPY src ./src
# RUN npm ci
# RUN npm run build
# RUN npm run copy-assets
# RUN npm run copy-env
# RUN npm prune --production

FROM gcr.io/distroless/nodejs18-debian11

COPY build .
COPY --from=builder /usr/src/app/node_modules /node_modules

CMD ["./index.js" ]