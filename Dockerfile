FROM node:latest
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts -g --silent
COPY . ./
CMD ["npm", "run", "prod"]
EXPOSE 3000
