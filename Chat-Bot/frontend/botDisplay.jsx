import { useState } from "react";
import axios from "axios";
import { useMessageState } from "../src/messageProvider";
import { getMessageStyles } from "../src/messageLogics"; // adjust path if needed
import "./BotDisplay.css";

const BotDisplay = () => {
  const [newMessage, setNewMessage] = useState("");
  const { allMessages, setAllMessages } = useMessageState();
  const [visible, setVisible] = useState(true); // state to toggle visibility
  const [loading,setloading]=useState(false)
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setloading(true);
    const userMsg = { role: "user", message: newMessage };
    setAllMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/ask", {
        message: newMessage,
      });

      const botReply = res.data.message;
      const botMsg = { role: "assistant", message: botReply };
      setAllMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("API error:", err);
    }finally{
        setloading(false);
    }

    setNewMessage("");
  };

  if (!visible) return null;

  return (
    <div className="chat-container">
      <button className="close-button" onClick={() => setVisible(false)}>
        ×
      </button>

      <div className="chat-box">
        {allMessages.map((msg, index) => {
          const { alignment, bgColor, textColor } = getMessageStyles(msg);
          return (
            <div
              key={index}
              className="chat-message"
              style={{
                textAlign: alignment,
                backgroundColor: bgColor,
                color: textColor,
                marginLeft: alignment === "left" ? 0 : "auto",
                marginRight: alignment === "right" ? 0 : "auto",
              }}
            >
              <strong>{msg.role}:</strong> {msg.message}
            </div>
          );
        })}
        {loading && (
            <div className="loading-spinner">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
)}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default BotDisplay;
