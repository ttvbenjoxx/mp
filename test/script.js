// Utility to parse query string
function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('key');
  const wish = urlParams.get('wish');
  return { apiKey, wish };
}

// Function to make a request to OpenAI API
async function processWish(apiKey, wish) {
  if (!apiKey || !wish) {
    document.body.innerHTML = `<h1>Error: Missing API Key or Wish</h1>`;
    return;
  }

  document.body.innerHTML = `<h1>Processing your wish...</h1>`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are Monkey\'s Paw. Grant wishes in unexpected ways.' },
          { role: 'user', content: wish },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process the request.');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    document.body.innerHTML = `
      <h1>Wish Granted</h1>
      <p><strong>Your Wish:</strong> ${wish}</p>
      <p><strong>Monkey's Paw:</strong> ${reply}</p>
    `;
  } catch (error) {
    document.body.innerHTML += `<h1>Error:</h1><p>${error.message}</p>`;
  }
}

// Main function to handle the API request
function handleRequest() {
  const { apiKey, wish } = getQueryParams();
  processWish(apiKey, wish);
}

// Run the handler
handleRequest();
