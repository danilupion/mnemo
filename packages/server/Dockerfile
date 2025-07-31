# ------ builder ------
ARG NODE_IMAGE=node:22.17.1-alpine
ARG BASE_IMAGE=mnemo/base

FROM ${BASE_IMAGE} AS server-builder

# install dependencies
RUN pnpm install --filter=@mnemo/server...

# build
RUN pnpm build --filter=@mnemo/server

# deploy
RUN pnpm deploy --filter=@mnemo/server --prod /workspace/server

# ------ runtime ------
FROM ${NODE_IMAGE} AS server-runtime

ARG PORT=3100
ARG ENV=production

WORKDIR /app

ENV NODE_ENV=${ENV}
ENV ENV=${ENV}

USER node

# copy minimal artifacts
COPY --from=server-builder /workspace/server/dist ./dist
COPY --from=server-builder /workspace/server/config ./config
COPY --from=server-builder /workspace/server/package.json .
COPY --from=server-builder /workspace/server/node_modules ./node_modules

# run the service
EXPOSE ${PORT}
CMD ["node", "dist/server.js"]