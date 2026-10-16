FROM eclipse-temurin:21.0.12.1_1-jre-jammy AS java
FROM node:24.21.0-bookworm-slim
COPY --from=java /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="/opt/java/openjdk/bin:${PATH}"
RUN corepack enable && corepack prepare pnpm@11.19.0 --activate
# Pinned development CLI, outside the application's production dependencies.
RUN pnpm add --global --global-bin-dir /usr/local/bin --global-dir /opt/firebase firebase-tools@14.16.0
WORKDIR /app
COPY firebase/firestore.rules firebase/firestore.indexes.json ./firebase/
COPY docker/firebase.container.json docker/emulator-entrypoint.sh ./docker/
RUN firebase setup:emulators:firestore && chmod +x docker/emulator-entrypoint.sh
EXPOSE 8085
ENTRYPOINT ["/app/docker/emulator-entrypoint.sh"]
