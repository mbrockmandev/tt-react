FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run secure-build

EXPOSE 3000

CMD ["npm", "start"]
