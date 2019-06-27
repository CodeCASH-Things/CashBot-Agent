FROM node:latest

MAINTAINER CodeCASH



ENV APP_REPO_URL="https://github.com/CodeCASH-Things/CashBot-Agent.git"
ENV SCRIPT_REPO_URL="https://github.com/CodeCASH-Things/mydicebot-scripts.git"
ENV APP_PATH="/app"
ENV SCRIPT_PATH="/script"

WORKDIR ${APP_PATH}

ADD entrypoint.sh /entrypoint.sh


EXPOSE 57432

CMD ["node","index.js"]

ENTRYPOINT ["/entrypoint.sh"]





