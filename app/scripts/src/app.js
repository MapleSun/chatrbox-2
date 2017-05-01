import socket from './ws-client';
import {UserStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]'

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if(!username) {
    username = promptForUsername();
    userStore.set(username);
}

class ChatApp {
    constructor() {
        this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
        this.chatList = new ChatList(LIST_SELECTOR, username);
        console.log(this);

        socket.init('ws://localhost:3001');
        socket.registerOpenHandler(() => {
            this.chatForm.init((data) => {
                console.log('chatForm data', data);
                let message = new ChatMessage({message: data});
                console.log('chatForm message   ', message);
                socket.sendMessage(message.serialize());

            });
            this.chatList.init();
        });
        socket.registerMessageHandler((data) => {
            let message = new ChatMessage(data);
            console.log('Message handler', data);
            this.chatList.drawMessage(message.serialize());
        });
    }
}


// can not pass parameter
class ChatMessage {
    constructor({
        message:m,
        user:u=username,
        timestamp:t= (new Date()).getTime()
    }) {
        //console.log("constructor", m);
        this.message = m;
        this.user = u;
        this.timestamp = t;
    }

    serialize() {
        return {
            user: this.user,
            message: this.message,
            timestamp: this.timestamp
        };
    }
}

export default ChatApp;
