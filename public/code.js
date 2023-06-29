
(function(){
    const app = document.querySelector('.app');
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname=username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".screen-chat").classList.add("active");

    });

    app.querySelector(".screen-chat #send-message").addEventListener("click", function() {
        console.log("send message");
        let message = app.querySelector(".screen-chat #message-input").value;
        if(message.length == 0) {
            return;
        }
        renderMessage("my",{
            username: uname,
            text: message,
        });
        socket.emit("chat", {
            username: uname,
            text: message,
        });
        app.querySelector(".screen-chat #message-input").value = "";
    });

    app.querySelector(".screen-chat #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
       window.location.href = window.location.href;
    });

    socket.on("update", function(message) {
        renderMessage("update", message);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function  renderMessage(type, message) {
        let messageElement = app.querySelector(".screen-chat .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = 
            `<div>
            <div class="name">You<div>
            <div class="text">${message.text}<div>
            </div>`;
            messageElement.appendChild(el);

        }else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = 
            `<div>
            <div class="name">${message.username}<div>
            <div class="text">${message.text}<div>
            </div>`;
            messageElement.appendChild(el);

        }else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageElement.appendChild(el);

        }
        messageElement.scrollTop = messageElement.scrollHeight - messageElement.clientHeight;
        
    }

  
})();

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".screen-chat #send-message").click();
    }
});