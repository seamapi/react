ARG VARIANT="22-bookworm"

FROM node:22.23.4-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d AS patched-node

FROM mcr.microsoft.com/devcontainers/javascript-node:1-${VARIANT}

# Patch the system binary and every inherited nvm copy used by interactive shells.
COPY --from=patched-node /usr/local/bin/node /tmp/patched-node
RUN install -m 0755 /tmp/patched-node /usr/local/bin/node \
 && if [ -d /usr/local/share/nvm/versions/node ]; then \
      find /usr/local/share/nvm/versions/node -type f -path "*/bin/node" \
        -exec install -m 0755 /tmp/patched-node {} \; ; \
    fi \
 && rm /tmp/patched-node \
 && test "$(node --version)" = "v22.23.4" \
 && test "$(/usr/local/bin/node --version)" = "v22.23.4"
ENV NODE_VERSION=22.23.4

USER node
WORKDIR /home/node

RUN mkdir -p .config/git \
 && echo ".vscode/*" >> .config/git/ignore \
 && echo "*.code-workspace" >> .config/git/ignore \
 && echo ".history/" >> .config/git/ignore
