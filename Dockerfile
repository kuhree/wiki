FROM oven/bun:1-alpine AS optimizer 
WORKDIR /usr/src/app
COPY . .
RUN rm -rf .quartz && \
	bun install date-fns sharp fluent-ffmpeg --no-save && \
	bun run wallls.ts --skipMarkdown --targets "archives,media" && \
	bun run wallls.ts --targets "gallery" 

FROM git.littlevibe.net/kuhree/quartz:latest AS builder
WORKDIR /usr/src/app
COPY --from=optimizer /usr/src/app/ /usr/src/app/content/
RUN npx quartz build -d content 

FROM caddy:2.8-alpine AS runner
ENV PORT=8080
COPY --from=builder /usr/src/app/public/ /usr/share/caddy/
COPY Caddyfile /etc/caddy/Caddyfile
HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1
