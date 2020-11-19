FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-12
WORKDIR /workspace
RUN mkdir /workspace/node_modules -p
