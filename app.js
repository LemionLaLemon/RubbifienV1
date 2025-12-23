// Initialize Firebase
const firebaseConfig = {
    };
   
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");

// Function to prompt the user for a username
var username = sessionStorage.getItem("username");

function sendMessage() {
  const message = messageInput.value;

  // Retrieve the user's "pfp" value from the "users" collection
  db.collection("users")
    .doc(username)
    .get()
    .then((userDoc) => {
      const pfpValue = userDoc.data().pfp;

      // Add the message, username, and pfp to the "messages" collection
      return db.collection("messages").add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: username,
        pfp: pfpValue,
      });
    })
    .then(() => {
      // Clear the input field
      messageInput.value = "";
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}


// Add event listener for Enter key press
messageInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
});

// Add event listener for send button click
sendButton.addEventListener("click", () => {
  sendMessage();
});

const chatMessages = document.getElementById("chat-messages");
let prevUsername = null;

// Listen for new messages and display them
// Listen for new messages and display them
// Listen for new messages and display them
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    const messages = [];

    snapshot.forEach((doc) => {
      const message = doc.data();
      messages.push(message);
    });

    // Create a document fragment to hold the new messages
    const fragment = document.createDocumentFragment();

    let prevUsername = null; // Initialize the previous username

    messages.forEach((message) => {
      // Console log the pfp number

      // Create a new message container
      const messageContainer = document.createElement("div");

      // Check if the username is the same as the previous message
      if (message.username !== prevUsername) {
        // Create an <img> element for the profile picture
        const profilePictureElement = document.createElement("img");
        const pfpValue = message.pfp; // Retrieve the "pfp" field value
        profilePictureElement.src = `/pfp/${pfpValue}.png`;
        profilePictureElement.alt = pfpValue; // Use pfpValue as alt text
        profilePictureElement.style.width = "30px";
        profilePictureElement.style.height = "30px";
        profilePictureElement.style.borderRadius = "50%";
        profilePictureElement.style.marginRight = "5px";
        profilePictureElement.style.marginBottom = "0px";
        messageContainer.appendChild(profilePictureElement);

        // Create a span element for the username
        const usernameElement = document.createElement("span");
        usernameElement.style.fontWeight = "bold";
        usernameElement.textContent = message.username;
        messageContainer.appendChild(usernameElement);

        // Create a line break element
        const lineBreak = document.createElement("br");
        messageContainer.appendChild(lineBreak);

        // Update the previous username
        prevUsername = message.username;
      }

      // Create a span element for the message content
      const messageContentElement = document.createElement("span");
      messageContentElement.textContent = message.text;
      messageContainer.appendChild(messageContentElement);

      // Append the message container to the fragment
      fragment.appendChild(messageContainer);

      // Create an <hr> element
      const hrElement = document.createElement("hr");

      // Append the <hr> element to the fragment
      fragment.appendChild(hrElement);
    });


    // Clear the chat area
    chatMessages.innerHTML = "";

    // Append the fragment containing the new messages to the chat area
    chatMessages.appendChild(fragment);

    // Scroll to the bottom after displaying messages
    scrollToBottom();
  });





  // Function to scroll to the bottom of the page
function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  
  // Event listener for scroll events on the message container
  messageContainer.addEventListener('scroll', function() {
    const scrollHeight = messageContainer.scrollHeight;
    const scrollTop = messageContainer.scrollTop;
    const clientHeight = messageContainer.clientHeight;
  
    // Check if the user has scrolled to the bottom
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
  
    // Update the auto scrolling flag based on user's scroll position
    isAutoScrolling = isAtBottom;
  });
  
  // Scroll to the bottom initially when the page loads
  scrollToBottom();
  