
/*******************************************
 /* Verify if element is visible in viewport
*******************************************/
function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

/**************************
 /* Send Message
***************************/
let messages = document.querySelector('.messagesLayout')
const sendBtn = document.querySelector('.sendBtn')
const sendInput = document.querySelector('.keyboard')

// Get Current Date
function getCurrentDate() {
    return new Date(Date.now() - (new Date().getTimezoneOffset() * 60 * 1000)).toISOString().slice(0,-5).replace("T", " ")
}

// Button/Enter Key
sendBtn.addEventListener('click', sendMessage)
sendInput.addEventListener('keyup', function(e) { 
    if(e.keyCode == 13) sendMessage() 
})

// Messenger Functions
function sendMessage() {
    let message = sendInput.value
    sendInput.value = ''
    // skip blank messages
    if(message.length < 1) {
    sendInput.placeholder = "Minimum length is 1 character!"
    } else {
    sendInput.placeholder = "Type your message..."
    let lastMessage = document.querySelector('.messagesLayout').lastChild
    lastMessageId = 0
    if (lastMessage !== null && 'getAttribute' in lastMessage) {
        lastMessageId = lastMessage.getAttribute('data-id-message')
    }
    lastMessageId++

    // @todo : send new message to server with fetch Position
    fetch('http://sil.asc.upenn.edu/exchange/chat/22', {
        method: 'POST',
        body: JSON.stringify({
        "id": lastMessageId,
        "content": message,
        "date": getCurrentDate(),
        "sent": true
        })
    })
    .then(response => response.json())
    .then(
        data => console.log(data) 
        writeLine(message, true, getCurrentDate(), lastMessageId)
    )
    }
}

function writeLine(text, sent, date, id) {
    const idExist = document.querySelector('[data-id-message="' + id + '"]')
    // If message doesn't exist, we create it 
    if(!idExist) {
    let message = document.createElement('P')
    message.dataset.idMessage = id
    sent ? message.classList.add('message', 'send') : message.classList.add('message', 'receive')
    message.innerHTML = text
    messages.appendChild(message)

    let lastMessage = document.querySelector('.message:nth-last-child(2)')
    /*const rect = lastMessage.getBoundingClientRect()
    const isInViewport = rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)*/

    if(isInViewport(lastMessage) === true) messages.scrollTop = messages.scrollHeight
    }
}

/**************************
 /* Refresh messages
***************************/

function refreshMessages() {
    fetch('http://sil.asc.upenn.edu/exchange/chat/22',{
    method: "GET"}).then(function (response) {
    // The API call was successful!
    return response.json()
    }).then(function (data) {
    // This is the JSON from our response
    Object.entries(data).forEach(([key, value]) => {
        writeLine(value.content, value.sent, value.date, value.id)
    })
    }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err)
    })
}

const intervalRefresh = setInterval(refreshMessages, 5000)