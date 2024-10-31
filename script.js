// Define bot responses for various questions
const all_questions_and_answers = {
  "How are you?": "I'm just a bot, but I'm here and ready to help you!",
  "What’s your name?": "I’m Alex, here to assist you with anything you need.",
  "What can you do?": "I can answer questions, provide information, and help you with tasks. Just ask!",
  "Tell me a joke": "Why did the developer go broke? Because they used up all their cache!",
  "Goodbye": "Goodbye! Let me know if you need help again!",
  "What is dynamo software?": "Dynamo Software is a company that provides cloud-based solutions for managing investments.",
  "What is javascript?": "JavaScript is a programming language commonly used for web development.",
  "How does automation work?": "Automation uses scripts or tools to perform tasks with minimal human intervention.",
  "What is ai?": "AI, or artificial intelligence, is a field focused on creating systems that can perform tasks typically requiring human intelligence.",
  "Can you help with scheduling?": "I can offer general advice or information about scheduling. What do you need help with?",
  "How do I improve english?": "Practice reading, writing, speaking, and listening every day. Using apps like Duolingo can also help.",
  "What is a chatbot?": "A chatbot is a program designed to simulate conversation with human users.",
  "How to learn programming?": "Start with a beginner-friendly language like Python, and practice through tutorials and projects.",
  "Who created you?": "I was developed by Alex Draganov.",
  "What is sql?": "SQL stands for Structured Query Language, used for managing and querying databases.",
  "How do I write css?": "CSS is a language for styling HTML content on the web. You can define styles in a .css file and link it to your HTML.",
  "Tell me about dynamo software": "Dynamo Software ..."
};

// Convert all_questions_and_answers keys to a formatted list of buttons
const questionsList = Object.keys(all_questions_and_answers)
  .map(question => `<button onclick="sendQuickResponse('${question}')">${question}</button>`)
  .join('<br>');

// Define bot default responses 
const responses = {
  "hello": "Hi there! How can I assist you today?",
  "yes, please!": `Great! Below you can find the questions I can answer:<br><br>${questionsList}`,
  "no, thanks.": "No problem! Let me know when you would like to learn more about Dynamo.",
};

// Track if "Yes, please!" has been clicked
let yesPleaseClicked = false;

// Function to prevent zooming on mobile
function preventZoom() {
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });
}

// Call the preventZoom function to enable it
preventZoom();

// Function to calculate the Levenshtein distance
function levenshteinDistance(a, b) {
  const matrix = [];

  // Create a matrix to hold distances
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Populate the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Function to check if input matches approximately 80% of predefined questions
function isApproximatelyEqual(input, predefinedText) {
  const distance = levenshteinDistance(input, predefinedText);
  const maxLength = Math.max(input.length, predefinedText.length);
  const similarity = (1 - distance / maxLength) * 100;
  return similarity >= 80; // Check if similarity is at least 80%
}

// Function to handle sending custom messages
function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim().toLowerCase();
  const chatBody = document.getElementById("chat-body");

  if (userInput) {
    // Display user's message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerText = userInput;
    chatBody.appendChild(userMessage);

    // Check for similar questions and get a bot response
    let botResponse = "I'm not sure how to respond to that. Please select a question from the list above or write it here directly.";
    for (const question of Object.keys(all_questions_and_answers)) {
      if (isApproximatelyEqual(userInput, question.toLowerCase())) {
        botResponse = all_questions_and_answers[question];
        break;
      }
    }

    // Display bot response
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = botResponse;
    chatBody.appendChild(botMessage);

    // Scroll to the latest message
    chatBody.scrollTop = chatBody.scrollHeight;

    // Clear input field
    document.getElementById("user-input").value = "";
  }
}

// Function to handle quick response buttons
function sendQuickResponse(response) {
  const chatBody = document.getElementById("chat-body");

  // Prevent double clicking "Yes, please!"
  if (response.toLowerCase() === "yes, please!" && yesPleaseClicked) {
    return; // Exit the function if already clicked
  }

  // If "Yes, please!" is clicked, set the flag to true
  if (response.toLowerCase() === "yes, please!") {
    yesPleaseClicked = true;
  }

  // Display user's response
  const userMessage = document.createElement("div");
  userMessage.classList.add("user-message");
  userMessage.innerText = response;
  chatBody.appendChild(userMessage);

  // Get bot response based on the response given
  let botResponse = "I'm not sure how to respond to that.";
  if (response.toLowerCase() === "yes, please!") {
    botResponse = responses[response.toLowerCase()];
  } else if (response.toLowerCase() === "no, thanks.") {
    botResponse = responses[response.toLowerCase()];
  } else {
	for (const question of Object.keys(all_questions_and_answers)) {
    if (isApproximatelyEqual(response, question)) {
      botResponse = all_questions_and_answers[question];
      break;
		}
	}
  }

  const botMessage = document.createElement("div");
  botMessage.classList.add("bot-message");
  botMessage.innerHTML = botResponse; // Use innerHTML here for formatted questions
  chatBody.appendChild(botMessage);

  // Scroll to the latest message
  chatBody.scrollTop = chatBody.scrollHeight;
}
