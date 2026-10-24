ARG VARIANT="22-bookworm"

FROM mcr.microsoft.com/devcontainers/javascript-node:1-${VARIANT}

# Refresh the bundled Node binary; a supported-major image can contain an older patch.
USER root
RUN su -s /bin/bash node -c "source /usr/local/share/nvm/nvm.sh && nvm install 22.23.4 && nvm alias default 22.23.4"
ENV PATH="/usr/local/share/nvm/versions/node/v22.23.4/bin:${PATH}"

USER node
WORKDIR /home/node

RUN mkdir -p .config/git \
 && echo ".vscode/*" >> .config/git/ignore \
 && echo "*.code-workspace" >> .config/git/ignore \
 && echo ".history/" >> .config/git/ignore
