FROM node:14

WORKDIR /app
COPY package*.json ./

RUN ["npm", "install"]
COPY . .

EXPOSE 3000
COPY ./wait-for-it.sh /usr/wait-for-it.sh
RUN ["chmod", "+x", "/usr/wait-for-it.sh"]