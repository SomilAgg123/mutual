# set up sessions
from flask import session, request
import uuid
import logging

from flask_socketio import join_room

def generate_session_id():
    return str(uuid.uuid4())

# # Configure logging
logging.basicConfig(level=logging.DEBUG)

def register_events(app, socketio):
    #### LOGIC STARTS HERE ####
    session_socket_map = {}

    @socketio.on('connect')
    def on_connect():
        app.logger.debug('Client connected')
        session_id = generate_session_id()
        session['session_id'] = session_id
        session_socket_map[request.sid] = session_id
        socketio.emit("session_id", session_id)

    @socketio.on('disconnect')
    def on_disconnect():
        disconnecting_socket_id = request.sid
        session_socket_map.pop(disconnecting_socket_id)

        app.logger.debug('Client disconnected')

    @socketio.on('message')
    def on_message(data):
        # get the room to send the message to
        room = data["room"]

        # set the sender of the server-sent message to be the original recipient
        msg = data["msg"]

        # check if the user has responded previously to determine if we need to update state on the UI
        hasRespondedPreviously = data["hasRespondedPreviously"]

        # send the message to the room the user is in
        socketio.emit("message", msg, room=room, broadcast=True, include_self=False)

        # send a notice to the user to update the last message that was sent
        msg_info = {
            "content": msg,
            "conversation_id": room
        }
        socketio.emit("update_last_msg", msg_info, room=request.sid)

        # if this is the first response ever from this user, update the message
        # status
        app.logger.debug(data)
        if not hasRespondedPreviously:
            socketio.emit("mark_unreplied_replied", msg_info, room=request.sid, broadcast=True, include_self=True)

    @socketio.on("join_room")
    def on_join(data):
        app.logger.debug("user: " + data["user"] + " has joined the room!")
        join_room(data["room"])