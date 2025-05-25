const API_URL_BASE_GPT4 = 'https://apis.davidcyriltech.my.id/ai/gpt4';

export const fetchAIResponse = async (inputText) => {
  try {
    const fullUrl = `${API_URL_BASE_GPT4}?text=${encodeURIComponent(inputText)}&lang=en`;
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `API request failed with status ${response.status}. Unable to parse error response.` };
      }
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    if (data.success && data.message) {
      return data.message;
    } else {
      throw new Error(data.message || 'Invalid API response structure from GPT-4');
    }
  } catch (error) {
    console.error('AI Service Error (GPT-4):', error);
    
    if (error.message && error.message.toLowerCase().includes("too many requests")) {
        return "I'm a bit overwhelmed with requests right now. Please try again in a few moments.";
    }
    if (error.message && (error.message.includes("我们聊的太多了") || error.message.includes("休息一会儿再来吧"))) {
        return "It seems I've been chatting a lot! Let's take a short break. Please try asking again in a little while.";
    }
    if (error.message && error.message.toLowerCase().includes("i'm sorry, i cannot fulfill that request")) {
      return "I'm sorry, I cannot fulfill that request at the moment. Please try something else.";
    }
    throw error; 
  }
};

// Placeholder for fetchAIImageResponse - no longer actively used by new API, but kept for potential future use.
export const fetchAIImageResponse = async (prompt) => {
  console.log("Image generation requested for prompt (currently inactive):", prompt);
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return { 
    success: false, 
    message: "Image generation feature is not currently connected to this AI model.",
  }; 
};