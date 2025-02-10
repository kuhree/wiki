FROM oven/bun:1 AS optimizer 
WORKDIR /usr/src/app
COPY . content
RUN rm -rf content/.quartz && \
	bun install date-fns sharp fluent-ffmpeg --no-save && \
	bun --cwd content wallls.ts --skipMarkdown --targets "archives,media" && \
	bun --cwd content wallls.ts --targets "gallery" 

FROM optimizer AS builder
WORKDIR /usr/src/app
COPY .quartz/ ./
RUN bun install && bun quartz build -d content 

FROM caddy:2.8-alpine AS runner
ENV PORT=8080
COPY --from=builder /usr/src/app/public/ /usr/share/caddy/
COPY Caddyfile /etc/caddy/Caddyfile
HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1
