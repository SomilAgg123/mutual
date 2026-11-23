"""Preserved Flask prototype; disabled by default. See ../README.md."""
import os

if os.environ.get("MUTUAL_ENABLE_LEGACY_API") != "1":
    raise RuntimeError(
        "The historical API is disabled. Run `python3 examples/match_demo.py` "
        "from the repository root for the supported demo. See backend/prototype/README.md."
    )

from flask import Flask
from flask_migrate import Migrate
from flask_socketio import SocketIO
from db import db

def init_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SECRET_KEY"] = os.environ["SESSION_SECRET_KEY"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    Migrate(app, db)
    socketio = SocketIO(app, cors_allowed_origins=["http://localhost:8081"], logger=False, engineio_logger=False)
    from .socket_events import register_events
    register_events(app, socketio)
    with app.app_context():
        from . import routes
        # Schema creation is no longer an import/startup side effect.
    return app, socketio
