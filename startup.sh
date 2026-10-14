#!/bin/sh
cd "$(dirname "$0")" || exit 1
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
  exit 0
fi
nohup setsid npm run dev >/tmp/turbz-dev.log 2>&1 </dev/null &
exit 0
