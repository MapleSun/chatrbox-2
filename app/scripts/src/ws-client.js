let socket;

function init(url) {
    socket = new WebSocket(url);
    console.log('connnecting...');
}

function registerOpenHandler(handlerFunction) {
    socket.onopen = () => {
        console.log('open');
        handlerFunction();
    };
}

function registerMessageHandler(handlerFunction) {
    console.log(socket);
    socket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        handlerFunction(data);
    };
}

function sendMessage(payload) {
    socket.send(JSON.stringify(payload));
}

export default {
    init,
    registerOpenHandler,
    registerMessageHandler,
    sendMessage
}
