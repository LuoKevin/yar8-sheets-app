from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .routers.sheets import sheets_router

app = FastAPI(
    title="YAR8 Sheets API",
    descriptions="Reads and performs operations on YAR8 Attendance Google Sheets",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:3000", "https://yar8-attendance-app-ui.fly.dev"],
    allow_methods=["*"],
    allow_headers=[],
)

app.include_router(router=sheets_router)

@app.get("/", include_in_schema=False)
def health_check():
    return {"status": "ok"}
