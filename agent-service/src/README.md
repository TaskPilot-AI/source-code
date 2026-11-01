# AgentX Service

Run from the project root after installing `requirements.txt`:

```powershell
uvicorn src.app:app --host 0.0.0.0 --port 5000
```

Configure `GOOGLE_API_KEY` (or `GEMINI_API_KEY`) and optionally `GOOGLE_MODEL`.
Prompt builders in [`prompts`](./prompts) generate the dynamic agent prompts
from request values. Each agent has a dedicated module in [`services`](./services).

Routes: `GET /`, `POST /pipeline`, `POST /init_project`,
`POST /identify_key_features`, `POST /generate_docs`, and `POST /create_tasks`.
The pipeline currently accepts JSON response mode, matching the backend client.
