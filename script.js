// Utility to parse URL parameters
function parseURL() {
  const path = window.location.pathname; // e.g., /API/chatGPT-api-key/Wish
  const segments = path.split('/').filter(Boolean); // Remove empty segments
  if (segments[0] === 'API' && segments.length === 3) {
    const apiKey = segments[1];
    const wish = decodeURIComponent(segments[2]);
    return { apiKey, wish };
  }
  return null;
}

// Main function
async function main() {
  const parsed = parseURL();
  if (parsed) {
    const { apiKey, wish } = parsed;
    localStorage.setItem('apiKey', apiKey); // Save key for later reuse
    await sendWish(apiKey, wish);
  } else {
    setupChatInterface(); // Load regular chat interface
  }
}

// Send a wish to OpenAI
async function sendWish(apiKey, wish) {
  const chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML = `<strong>You:</strong> ${wish}<br><strong>Monkey's Paw:</strong> Thinking...`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are Monkey\'s Paw. Grant wishes in unexpected ways.' },
          { role: 'user', content: wish }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    chatOutput.innerHTML = `<strong>You:</strong> ${wish}<br><strong>Monkey's Paw:</strong> ${reply}`;
  } catch (error) {
    chatOutput.innerHTML = `<strong>Error:</strong> Could not process your wish.`;
  }
}

// Regular chat interface setup
function setupChatInterface() {
  const apiKeyInput = document.getElementById('api-key');
  const saveKeyButton = document.getElementById('save-key');
  const chatContainer = document.getElementById('chat-container');
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

    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      alert('API Key not found. Please enter it again.');
      return;
    }

    await sendWish(apiKey, userMessage);
  });
}

// Initialize
main();
