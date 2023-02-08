FROM node:19.0.0-bullseye-slim as builder

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm ci
RUN npm run build
RUN npm run copy-assets
COPY ./.env ./build/.env
RUN npm prune --production

FROM gcr.io/distroless/nodejs18-debian11

COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/node_modules /node_modules

ENV NODE_ENV production
CMD ["./index.js" ]