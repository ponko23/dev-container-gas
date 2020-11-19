FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-12

# ** [Optional] Uncomment this section to install additional packages. **
#
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get update \
#    && apt-get -y install --no-install-recommends <your-package-list-here> \
#    #
#    # Clean up
#    && apt-get autoremove -y \
#    && apt-get clean -y \
#    && rm -rf /var/lib/apt/lists/*
# ENV DEBIAN_FRONTEND=dialog
WORKDIR /workspace
RUN mkdir /workspace/node_modules -p
