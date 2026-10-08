FROM node:24.21.0-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.19.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --ignore-scripts --filter frontend
# Only public OIDC/application configuration. Never add a private adapter/key here.
ARG NEXT_PUBLIC_API_URL=http://localhost:5001
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_APP_NAME=SOC
ARG NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL
ARG NEXT_PUBLIC_TIDECLOAK_REALM
ARG NEXT_PUBLIC_TIDECLOAK_CLIENT_ID
ARG NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED=external
ARG NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL=${NEXT_PUBLIC_TIDECLOAK_AUTH_SERVER_URL} NEXT_PUBLIC_TIDECLOAK_REALM=${NEXT_PUBLIC_TIDECLOAK_REALM} NEXT_PUBLIC_TIDECLOAK_CLIENT_ID=${NEXT_PUBLIC_TIDECLOAK_CLIENT_ID}
ENV NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED=${NEXT_PUBLIC_TIDECLOAK_SSL_REQUIRED} NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI=${NEXT_PUBLIC_TIDECLOAK_REDIRECT_URI} NEXT_TELEMETRY_DISABLED=1
COPY frontend/src ./frontend/src
COPY frontend/public ./frontend/public
COPY frontend/scripts ./frontend/scripts
COPY frontend/tsconfig.json frontend/next.config.ts frontend/postcss.config.mjs ./frontend/
RUN pnpm --filter frontend build

FROM node:24.21.0-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=build --chown=node:node /app/frontend/public ./frontend/public
USER node
EXPOSE 3000
CMD ["node","frontend/server.js"]
