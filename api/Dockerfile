# STAGE 1
FROM mhart/alpine-node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2
FROM mhart/alpine-node:16
WORKDIR /app
COPY package*.json ./
RUN npm install -g pm2
# RUN npm install --save-dev sequelize-cli
RUN npm install --production
COPY --from=builder /app/build ./build

# COPY --chown=node:node .env .
# COPY --chown=node:node .sequelizerc .
COPY /config ./config
COPY pm2.config.js ./
# COPY --chown=node:node  /public ./public


# RUN npm run migrate
# RUN npx sequelize db:seed:all; exit 0
# RUN npm un sequelize-cli

EXPOSE 3001
CMD [ "pm2-runtime", "start", "pm2.config.js" ]

