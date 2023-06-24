FROM node:16
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --force

COPY . .
RUN npx -y prisma generate
CMD npm run build && npm run start -- --port $PORT