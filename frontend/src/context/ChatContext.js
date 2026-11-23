import createDataContext from './createDataContext';

const chatReducer = (state, action) => {
    switch (action.type) {
        case 'createMessage':
            return {
                ...state,
                result: action.payload.result
            };
        default:
            return state;
    }
};

const createMessage = dispatch => {
    return async (message, room_id, session_id_from, session_id_to) => {
        async function sendMessage(message, room_id, session_id_from, session_id_to) {
            return fetch('http://127.0.0.1:5000/api/message/' + room_id + '/' + session_id_from + '/' + session_id_to,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
        }

        const result = await sendMessage(message, room_id, session_id_from, session_id_to);

        dispatch({
            type: 'createMessage',
            payload: {
                result: result
            }
        })
    }
}

export const { Provider: ChatProvider, Context: ChatContext } = createDataContext(
    chatReducer,
    {
        createMessage
    },
    { result: null },
);