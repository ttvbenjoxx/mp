const apiKeyInput = document.getElementById('api-key');
const saveKeyButton = document.getElementById('save-key');
const chatContainer = document.getElementById('chat-container');
const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');
const sendWishButton = document.getElementById('send-wish');

saveKeyButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    localStorage.setItem('apiKey', apiKey);
    apiKeyInput.value = '';
    alert('API Key saved!');
    chatContainer.hidden = false;
  }
});

sendWishButton.addEventListener('click', async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage('You', userMessage);
  userInput.value = '';

  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    alert('API Key not found. Please enter it again.');
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are Monkey\'s Paw. Grant wishes in unexpected ways.' }, 
                   { role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage('Monkey\'s Paw', reply);
  } catch (error) {
    appendMessage('Error', 'Failed to fetch response. Check your API key.');
  }
});

function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatOutput.appendChild(msgDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}
