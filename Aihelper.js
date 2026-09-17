import React, { useState } from "react";
import "./AIHelpBox.css";

export default function AIHelpBox({ currentStepContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! Main aapka AI Sorting Mentor hoon. Agar 3D view mein kisi step par confusion ho, toh aap mujhse turant pooch sakte hain!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    // ---> YAHAN USER QUERY KE SATH 3D VIEW KA CURRENT STEP BHI JOD RAHE HAIN <---
    const contextDescription = currentStepContext 
      ? `Current 3D Simulation Status -> Step: "${currentStepContext.explanation}", Loop Type: "${currentStepContext.loopType}", Loop Variables (i=${currentStepContext.variables.i}, j=${currentStepContext.variables.j}).` 
      : "Simulation is not started yet.";

    const fullPrompt = `${contextDescription}\n\nUser Question: ${query}`;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "Maaf kijiye, server se response nahi mila." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Server se connect karne mein samasya aa rahi hai." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-help-container">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-help-toggle-btn"
          title="Ask AI about this step"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="ai-help-panel">
          <div className="ai-help-header">
            <div className="ai-help-title-wrapper">
              <span className="ai-help-icon">✨</span>
              <span className="ai-help-title-text">Context-Aware AI Mentor</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ai-help-close-btn"
            >
              ✕
            </button>
          </div>

          <div className="ai-help-messages-area">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-help-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-help-msg ai" style={{ fontStyle: "italic", color: "#94a3b8" }}>
                AI is analyzing this exact step...
              </div>
            )}
          </div>

          {/* Direct "Explain This Step" Action Button */}
          <div className="ai-quick-chips">
            <button 
              className="ai-chip" 
              onClick={() => handleSend("Mujhe yeh current step samajh nahi aaya, yeh kaise ho raha hai?")}
            >
              🔍 Explain Current Step
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="ai-help-form">
            <input
              type="text"
              placeholder="Ask why this swap happened..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="ai-help-input"
              disabled={isLoading}
            />
            <button type="submit" className="ai-help-send-btn" disabled={isLoading}>
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}