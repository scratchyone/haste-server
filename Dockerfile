FROM node:16
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --force

COPY . .
RUN npx -y prisma generate
RUN npm run build
CMD npm run start -- --port $PORT