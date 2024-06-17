FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

#RUN npm run check

RUN npm run build

EXPOSE 3666

CMD ["npm", "start"]