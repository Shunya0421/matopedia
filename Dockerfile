# ---- ビルドステージ ----
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# 本番用の秘密情報は .env ではなく環境変数で注入するため、ローカル用 .env は除外
RUN rm -f .env && npm run build

# ---- 実行ステージ ----
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
