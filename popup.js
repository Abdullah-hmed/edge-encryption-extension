
document.addEventListener('DOMContentLoaded', function() {
    // Query the active tab to get messages
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getMessages"}, function(response) {
            if (response) {
                displayMessages(response);
            }
        });
    });
});


function displayMessages(messages) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = ''; // Clear existing messages
    
    messages.forEach(message => {
        const li = document.createElement('li');
        li.className = 'message-item';
        li.innerHTML = `
            <span class="sender-name">${message.senderName || 'Unknown'}</span>
            <span class="message-text">${message.messageText}</span>
        `;
        messageList.appendChild(li);
    });
    console.log(messages);
}