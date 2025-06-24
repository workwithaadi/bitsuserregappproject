# Stage 1: Build Application
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Use distroless Node.js runtime

FROM gcr.io/distroless/nodejs18

COPY --from=base /app .

EXPOSE 5050

CMD [ "server.js" ]

