/* ============================================================
   LOTAN RISK ADVISOR — CHROME EXTENSION POPUP LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chipsContainer = document.getElementById("chips-container");

  // Focus on input field when extension is opened
  chatInput.focus();

  // ── Local TF-IDF Search Engine ───────────────────────────
  
  // Tokenize text into words with at least 3 characters
  function tokenize(text) {
    return text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  }

  // Precompute Document Frequency (DF) across the knowledge base
  const N = FAQ_DATA.length;
  const df = {};
  FAQ_DATA.forEach(item => {
    // Combine Q and A for vector mapping
    const combinedTokens = new Set(tokenize(item.q + " " + item.a));
    combinedTokens.forEach(t => {
      df[t] = (df[t] || 0) + 1;
    });
  });

  // Calculate Inverse Document Frequency (IDF)
  function computeIdf(word) {
    const docFreq = df[word] || 0;
    return Math.log((N + 1) / (docFreq + 1)) + 1;
  }

  // Generate answer based on similarity scoring
  function getResponse(query) {
    const queryTokens = new Set(tokenize(query));
    if (queryTokens.size === 0) {
      return "Please ask a question about credit protection, performance bonds, or our advisory services.";
    }

    let bestAnswer = "I'm sorry, I couldn't find specific details regarding that in our documentation. Please contact our advisory team directly at info@lia.insure.";
    let bestScore = 0;

    FAQ_DATA.forEach(item => {
      const combinedText = item.q + " " + item.a;
      const tokens = tokenize(combinedText);
      if (tokens.length === 0) return;

      // Compute Term Frequency (TF)
      const tf = {};
      tokens.forEach(t => {
        tf[t] = (tf[t] || 0) + 1;
      });

      // Calculate matching score
      let score = 0;
      queryTokens.forEach(qt => {
        if (tf[qt]) {
          score += (tf[qt] / tokens.length) * computeIdf(qt);
        }
      });

      // Exact phrase match boost
      if (combinedText.toLowerCase().includes(query.toLowerCase())) {
        score += 2.0;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = item.a;
      }
    });

    // Score threshold check to prevent irrelevant answers
    if (bestScore < 0.05) {
      return "I'm sorry, I couldn't find specific details regarding that in our documentation. Please contact our advisory team directly at info@lia.insure.";
    }

    return bestAnswer;
  }

  // ── UI Message Rendering ─────────────────────────────────

  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${isUser ? "user-message" : "bot-message"} fade-in-up`;
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    
    // Replace newlines with <br> for clean formatting of lists/paragraphs
    contentDiv.innerHTML = text.replace(/\n/g, "<br>");
    
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    
    // Smooth scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Render typing bubble
  function showTypingIndicator() {
    const indicatorDiv = document.createElement("div");
    indicatorDiv.id = "typing-indicator";
    indicatorDiv.className = "typing-indicator fade-in-up";
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "typing-dot";
      indicatorDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(indicatorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicatorDiv;
  }

  // Handle message sending flow
  function handleSend(queryText) {
    const q = queryText || chatInput.value.trim();
    if (!q) return;

    if (!queryText) {
      chatInput.value = "";
    }

    // Add user message
    addMessage(q, true);

    // Show typing state
    const typingIndicator = showTypingIndicator();

    // Artificial thinking delay for premium feel
    setTimeout(() => {
      typingIndicator.remove();
      const responseText = getResponse(q);
      addMessage(responseText, false);
    }, 600);
  }

  // ── Event Listeners ──────────────────────────────────────

  // Send button click
  sendBtn.addEventListener("click", () => handleSend());

  // Input Enter key press
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // Prompt chips click
  chipsContainer.addEventListener("click", (e) => {
    const clickedChip = e.target.closest(".chip");
    if (!clickedChip) return;

    const query = clickedChip.getAttribute("data-query");
    if (query) {
      handleSend(query);
    }
  });
});
