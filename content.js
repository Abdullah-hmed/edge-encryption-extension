// Track which messages we've already added buttons to
const processedMessages = new Set();

// Function to decrypt message text (implement your decryption logic)
function decryptMessage(encryptedText) {
    return encryptedText.split("").reverse().join(""); // Replace with real decryption logic
}

// Function to inject a button next to each message element
function injectButton(messageElement) {
    // Check if we've already processed this message
    if (processedMessages.has(messageElement)) {
        return;
    }

    // Check if button already exists
    if (messageElement.querySelector('.decrypt-button')) {
        return;
    }

    const decryptButton = document.createElement('button');
    decryptButton.textContent = "Decrypt";
    decryptButton.className = "decrypt-button";

    // Add some basic styling
    decryptButton.style.marginLeft = '8px';
    decryptButton.style.padding = '4px 8px';
    decryptButton.style.borderRadius = '4px';
    decryptButton.style.border = '1px solid #ccc';
    decryptButton.style.background = '#fff';
    decryptButton.style.cursor = 'pointer';

    const textElement = messageElement.querySelector('span[dir="ltr"]');
    if (!textElement) return;

    textElement.parentNode.parentNode.parentNode.appendChild(decryptButton);

    decryptButton.addEventListener('click', () => {
        const messageText = textElement.textContent.trim();
        const senderName = getMessageSenderName(messageElement).toString();
        const decryptedMessage = decryptMessage(messageText).toString();
        textElement.textContent = decryptedMessage;
        console.log(senderName,":", decryptedMessage);
    });

    // Mark this message as processed
    processedMessages.add(messageElement);
}

// Inject the decrypt button for each message
function addDecryptButtons() {
    const messageElements = document.querySelectorAll('div[role="row"]');
    messageElements.forEach((messageElement) => {
        injectButton(messageElement);
    });
}

// Debounce function to prevent too many rapid calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to handle chat changes
function handleChatChange() {
    // Clear the processed messages set when changing chats
    processedMessages.clear();
    // Add buttons to messages in the new chat
    startObserver();
}

// Function to get the current chat name
function getCurrentChatName() {
    const chatNameElement = document.querySelector("#main > header > div._amie > div._amif > div > div > span.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1rg5ohu._ao3e");
    return chatNameElement ? chatNameElement.textContent : '';
}

// Function to get the sender name
function getMessageSenderName(messageElement) {
    const senderNameElement = messageElement.querySelector("div.copyable-text[data-pre-plain-text]");
    if (senderNameElement) {
        const senderName = senderNameElement.getAttribute("data-pre-plain-text");
        return senderName.match(/\] (.+?):/)[1];
    }
    return "";
}

// Create observers for both the main container and chat changes
function startObserver() {
    // Watch for changes in the chat messages container
    const chatContainer = document.querySelector('.x3psx0u.xwib8y2.xkhd6sd.xrmvbpv');
    
    if (!chatContainer) {
        console.log('Chat container not found, retrying...');
        setTimeout(startObserver, 1000);
        return;
    }
    console.log(getCurrentChatName());
    const debouncedAddButtons = debounce(addDecryptButtons, 500);

    // Create observer for new messages
    const messageObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                debouncedAddButtons();
            }
        });
    });

    messageObserver.observe(chatContainer, {
        childList: true,
        subtree: true
    });

    // Watch for chat changes by observing the main chat area
    const mainContainer = document.querySelector('#main');
    
    if (mainContainer) {
        let lastChatName = getCurrentChatName();
        
        const chatChangeObserver = new MutationObserver((mutations) => {
            const currentChatName = getCurrentChatName();
            if (currentChatName && currentChatName !== lastChatName) {
                lastChatName = currentChatName;
                console.log('Chat changed to:', currentChatName);
                handleChatChange();
            }
        });

        chatChangeObserver.observe(mainContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Add buttons to existing messages
    addDecryptButtons();
}

// Start the observer when the script loads
console.log('Decrypt button script loaded');
startObserver();