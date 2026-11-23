import { io } from "socket.io-client";
const socket = io.connect('http://127.0.0.1:5000', {
    path: '/socket.io',
    transports: ['websocket'],
    reconnection: 'false',
});
// const socket = io.connect('http://127.0.0.1:5000', {
//     path: '/socket.io',
//     reconnection: 'false',
// });
// console.log("SOCKET CONNECTIVITY: ", socket.connected);

// const socket = io.connect('http://127.0.0.1:5000')
export default socket;