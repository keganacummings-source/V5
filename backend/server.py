import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

app = FastAPI()
UPSTREAM = "http://127.0.0.1:3000"
HOP = {"host", "content-length", "connection", "transfer-encoding", "content-encoding", "accept-encoding"}
client = httpx.AsyncClient(base_url=UPSTREAM, timeout=60.0)


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(path: str, request: Request):
    headers = {k: v for k, v in request.headers.items() if k.lower() not in HOP}
    headers["x-forwarded-host"] = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    headers["x-forwarded-proto"] = request.headers.get("x-forwarded-proto", "https")
    upstream = await client.request(
        request.method,
        f"/api/{path}",
        params=request.query_params,
        content=await request.body(),
        headers=headers,
    )
    out = Response(content=upstream.content, status_code=upstream.status_code)
    for k, v in upstream.headers.multi_items():
        if k.lower() in HOP:
            continue
        if k.lower() == "set-cookie":
            out.headers.append(k, v)
        else:
            out.headers[k] = v
    return out
