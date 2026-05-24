# Backend Hosting Decision

GreenTracer can keep the current backend on Render for now. Do not migrate to a VPS until scan volume, badge rendering, or badge ping volume shows a clear operational need.

Keep badge rendering lightweight:

- Serve the badge loader as a small static script.
- Keep install/load pings best-effort and non-blocking.
- Do not let tracking failure stop badge rendering.
- Avoid collecting personal data beyond operational install diagnostics.

Later, consider CDN or edge delivery for the badge JavaScript and a lightweight ping endpoint if public badge traffic becomes a material source of load.
