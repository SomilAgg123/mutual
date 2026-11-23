# Historical Flask prototype

This is a sanitized snapshot of the original Flask API, SQLAlchemy models, processors, Socket.IO events, photo integration, and NumPy matching algorithm. It is retained to show how the original application was structured.

It is **not a supported server or a deployment target**. Importing `app` raises a clear error by default, before any third-party dependencies are imported or cloud clients are created. The supported local demo is `python3 examples/match_demo.py` from the repository root.

## Source map

| File / directory | Purpose |
| --- | --- |
| [app/routes.py](app/routes.py) | Original profile, credential, scoring, introduction, photo, and chat endpoints |
| [app/models](app/models) | Original data model |
| [app/processors](app/processors) | User and message persistence helpers |
| [app/socket_events.py](app/socket_events.py) | Socket.IO event handlers |
| [app/algorithm](app/algorithm) | Original matching implementation, weights, enums, and reason text |
| [app/aws_controller.py](app/aws_controller.py) | DynamoDB photo metadata |
| [migrations](migrations) | Historical migration scaffold; does not reproduce the app schema |
| [requirements-2023.txt](requirements-2023.txt) | Original dependency list, retained as an incomplete historical reference |

## Sanitization and execution boundary

Embedded AWS credentials, database passwords, signing secrets, and private endpoints have been removed. AWS calls now use the normal SDK credential chain. Database and signing configuration must come from environment variables. Automatic database schema creation at startup was removed.

The `MUTUAL_ENABLE_LEGACY_API=1` switch exists for deliberate future maintenance, not as a recommended quickstart. Even with that switch, the original dependencies, a new database schema, configuration, and substantial application repairs are needed. In particular, `DATABASE_URL`, `SESSION_SECRET_KEY`, and `JWT_SECRET_KEY` must be provided; none has a usable fallback. The original requirements list omits Flask-SocketIO and is not a reproducible environment specification.

Enabling the prototype does not repair its authorization. The token route still contains a historical authorization stub; user APIs can expose credential fields, and socket room membership is not authenticated. The original scoring code and its defects are intentionally preserved here for comparison with [the maintained package](../matching).

See [feature status](../../docs/status.md) before attempting further work. Do not connect this prototype to real user data or publish it as a service in its current state.
