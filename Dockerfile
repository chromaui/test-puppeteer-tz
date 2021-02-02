FROM node:12-buster-slim AS build

RUN apt-get update \
    && apt-get install -y g++ make cmake unzip libcurl4-openssl-dev autoconf build-essential libtool python \
    && npm install aws-lambda-ric \
    && rm -rf /var/lib/apt/lists/*

FROM node:12-buster-slim

ENV LANG en_US.UTF-8
ENV TZ UTC

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* 

COPY --from=build /node_modules /node_modules

ADD https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.0/aws-lambda-rie /usr/local/bin/aws-lambda-rie
RUN chmod +x /usr/local/bin/aws-lambda-rie

WORKDIR /var/task

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY index.js .

ENTRYPOINT ["/usr/local/bin/aws-lambda-rie", "/node_modules/.bin/aws-lambda-ric"]
CMD [ "index.index" ]