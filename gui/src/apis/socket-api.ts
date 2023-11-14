import useWebSocket, { ReadyState } from 'react-use-websocket';

// const endpoint = 'http://172.250.250.181/live';

// const connect = () => {
//   socket.connect();
// };

// const disconnect = () => {
//   socket.disconnect();
// };

// const subscribeToWebSocket = (event, callback) => {
//   socket.on(event, callback);
// };

// const unsubscribeFromWebSocket = (event, callback) => {
//   socket.off(event, callback);
// };

// const sendMessage = (message) => {
//   if (socket) {
//     socket.emit('live', message);
//   }
// }


// socket.on('connect', () => {
//   console.log('WebSocket connection established');
// });

// export { connect, disconnect, subscribeToWebSocket, unsubscribeFromWebSocket, sendMessage };



// class SocketApiHelper {
//   createConnection({
//     endpoint,
//     token,
//   }:{
//     endpoint:string;
//     token?: string;
//   }){

//     const headers = {
//       extraHeaders: {}
//     }

//     if(token){
//       console.log("Adding Token to Socket Headers");
//       headers['extraHeaders']['Authorization'] = `Bearer ${token}`;
//     }

//     console.log("Attemping Connection to: " + endpoint);
    
//     const socket = new WebSocket(endpoint);
//     return socket;
//   }
// }

// export const socketApiHelper = new SocketApiHelper();


class SocketApiHelper {
  createConnection({
    endpoint,
    token,
  }:{
    endpoint:string;
    token?: string;
  }){

    const headers = {
      extraHeaders: {}
    }

    if(token){
      console.log("Adding Token to Socket Headers");
      headers['extraHeaders']['Authorization'] = `Bearer ${token}`;
    }

    console.log("Attemping Connection to: " + endpoint);
    
    const socket = new WebSocket(endpoint);
    return socket;
  }
}

export const socketApiHelper = new SocketApiHelper();