FROM node:16-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --force

COPY . .
CMD npm run build && npm run start -- --port $PORT