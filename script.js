// Define bot responses for various questions
const all_questions_and_answers = {
  "What is Dynamo Data Automation, and how can it impact client data management?": "Dynamo Data Automation is one of Dynamo’s business product lines: we automate data collection, processing, and integration specifically for the financial industry, making it easier and faster to manage large data sets with accuracy and reliability.",
  "How big is Dynamo’s team?.": "Nearly 500 people globally. We’re more than 210 people in Sofia and 80 people in DDA in particular. Want to get to know us better? <a href='https://www.dynamosoftware.com/about/'>Our Story</a>",
  "What are the skills a Dynamo Data Automation user or developer can benefit from?": "Knowledge of data management, some experience with APIs, data analytics, and an understanding of financial data systems are beneficial. Programming skills in Python or SQL can be a plus for advanced customization.",
  "What’s our work model?": "We’re working hybrid, meaning you will have some flexibility to combine work with university studies.",
  "What career paths might benefit from experience with Dynamo Data Automation?": "Roles in data engineering, financial analysis, project and product management. Don’t miss our Profiling game and check out which team is your best personality match.",
  "What are some real-world examples of problems Dynamo Data Automation solves?": "It helps with aggregating performance metrics, managing compliance data, and tracking investor information efficiently.",
  "What makes the Dynamo Data Automation team unique?": "Our people, you can meet some of them today."
};

// Convert all_questions_and_answers keys to a formatted list of buttons
const questionsList = Object.keys(all_questions_and_answers)
  .map(question => `<button onclick="sendQuickResponse('${question}')">${question}</button>`)
  .join('<br>');

// Define bot default responses 
const responses = {
  "hello": "Hi there! I’m Alex, Transformation Lead part of Dynamo Data Automation team. Do you want to learn more about Dynamo today?",
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
