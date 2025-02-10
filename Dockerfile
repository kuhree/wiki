FROM oven/bun:1-alpine AS optimizer 
WORKDIR /usr/src/app
COPY . .
RUN rm -rf .quartz && \
	bun install --no-save date-fns sharp fluent-ffmpeg && \
	bun run wallls.ts --skipMarkdown --targets "archives,media" && \
	bun run wallls.ts --targets "gallery" && \
	rm -rf node_modules package.json

FROM oven/bun:1-slim AS builder 
WORKDIR /usr/src/app
COPY .quartz ./
COPY --from=optimizer /usr/src/app/ /usr/src/app/content/
RUN bun install --production --frozen-lockfile && \
	bun quartz build -d content

# Alternative builder
# FROM git.littlevibe.net/kuhree/quartz:latest AS builder
# WORKDIR /usr/src/app
# COPY --from=optimizer /usr/src/app/ /usr/src/app/content/
# RUN npx quartz build -d content 

FROM caddy:2.8-alpine AS runner
ENV PORT=8080
COPY --from=builder /usr/src/app/public/ /usr/share/caddy/
COPY Caddyfile /etc/caddy/Caddyfile
HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1
