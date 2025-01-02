FROM node:20

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4001
EXPOSE 4002

ARG SERVER_TYPE
ENV SERVER_TYPE=${SERVER_TYPE}

CMD ["sh", "-c", "node dist/main-${SERVER_TYPE}.js"]
