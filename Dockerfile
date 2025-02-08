FROM oven/bun:1-alpine AS optimizer 
WORKDIR /usr/src/app
COPY . content
RUN bun install date-fns sharp fluent-ffmpeg --no-save && \
	bun --cwd content wallls.ts --skipMarkdown --targets "archives,media" && \
	bun --cwd content wallls.ts --targets "gallery" 

FROM ghcr.io/jackyzha0/quartz:latest AS builder
WORKDIR /usr/src/app
COPY quartz.layout.ts quartz.config.ts ./
COPY --from=optimizer /usr/src/app/content/ content/
RUN npx quartz build -d content 

FROM caddy:2.8-alpine AS runner
ENV PORT=8080
COPY --from=builder /usr/src/app/public/ /usr/share/caddy/
RUN /bin/sh -c "printf ':%s {\n    root * /usr/share/caddy\n    try_files {path} {path}.html {path}/ =404\n    file_server\n    encode gzip\n\n    handle_errors {\n        rewrite * /{http.error.status_code}.html\n        file_server\n    }\n}\n' \"$PORT\" > /etc/caddy/Caddyfile && cat /etc/caddy/Caddyfile"
