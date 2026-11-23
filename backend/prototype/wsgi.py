"""
wsgi application instance to deploy app behind nginx reverse proxy to uwsgi
"""
from app import init_app
# from app import db
import uuid
import logging

app, socketio = init_app()
# Secret configuration is supplied through the environment.

if __name__ == "__main__":
    socketio.run(app, port=8080)