FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
ARG GITHUB_AUTH_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_AUTH_TOKEN}" >> .npmrc
RUN cat .npmrc
RUN npm config set @juki-team:registry https://npm.pkg.github.com
RUN yarn --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN sed -i 's~    // output.*$~    output: "standalone",~g' ./next.config.js

# This will do the trick, use the corresponding env file for each environment.
ARG NODE_ENV
ARG JUKI_SERVICE_BASE_URL
ARG JUKI_TOKEN_NAME
RUN cp ./.env.sample ./.env \
    && sed -i 's/^NODE_ENV=.*$/NODE_ENV=${NODE_ENV}/g' ./.env \
    && sed -i 's/^NEXT_PUBLIC_NODE_ENV=.*$/NEXT_PUBLIC_NODE_ENV=${NODE_ENV}/g' ./.env \
    && sed -i 's/^NEXT_PUBLIC_JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL=.*$/NEXT_PUBLIC_JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL=${JUKI_SERVICE_BASE_URL}/g' ./.env \
    && sed -i 's/^NEXT_PUBLIC_JUKI_TOKEN_NAME=.*$/NEXT_PUBLIC_JUKI_TOKEN_NAME=${JUKI_TOKEN_NAME}/g' ./.env
RUN yarn build
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]