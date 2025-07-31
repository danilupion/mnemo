ARG NODE_IMAGE=node:24.4.1-alpine
ARG PNPM_VERSION=10.13.1

FROM ${NODE_IMAGE} AS base

ARG ENV=production

ENV CI=true
ENV NODE_ENV=${ENV}
ENV ENV=${ENV}

# install pnpm
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

# workdir
WORKDIR /workspace/repo

# copy repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.build.json tsconfig.json turbo.json ./
COPY packages/ packages/
