// script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const userSelect = document.getElementById('user-select');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value;
        const currentUser = userSelect.value;

        if (messageText.trim()) {
            addMessageToChatBox(messageText, currentUser);
            messageInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    function addMessageToChatBox(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const messageContent = document.createElement('div');
        messageContent.textContent = message;
        messageElement.appendChild(messageContent);

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        const now = new Date();
        const timeString = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = timeString;
        messageElement.appendChild(timeElement);

        chatBox.appendChild(messageElement);
    }
});
