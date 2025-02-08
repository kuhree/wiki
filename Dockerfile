FROM oven/bun:1-alpine AS optimizer 
WORKDIR /usr/src/app
COPY . content
RUN bun install date-fns sharp fluent-ffmpeg --no-save && \
  bun --cwd content wallls.ts --skipMarkdown --targets "archives,media" && \
  bun --cwd content wallls.ts --targets "gallery" 


FROM git.littlevibe.net/kuhree/quartz:latest AS builder
WORKDIR /usr/src/app
COPY --from=optimizer /usr/src/app/content/ content/
RUN npx quartz build -d content 

FROM caddy:2.8-alpine AS runner
ENV PORT=8080
COPY --from=builder /usr/src/app/public/ /usr/share/caddy/
RUN cat > /etc/caddy/Caddyfile <<EOF
:${PORT} {
    root * /usr/share/caddy
    try_files {path} {path}.html {path}/ =404
    file_server
    encode gzip

    handle_errors {
        rewrite * /{err.status_code}.html
        file_server
    }
}
EOF

EXPOSE $PORT
