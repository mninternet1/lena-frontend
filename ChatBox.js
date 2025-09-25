import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    const res = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/chat",
      { user_id: "mateusz123", text: input }
    );

    setMessages((prev) => [
      ...prev,
      userMessage,
      { sender: "lena", text: res.data.reply },
    ]);
    setInput("");
  };

  return (
    <div style={{ width: "400px", border: "1px solid #ccc", borderRadius: 8, padding: 20 }}>
      <h2>Lena 💬</h2>
      <div style={{ height: "300px", overflowY: "auto", marginBottom: 10 }}>
        {messages.map((m, i) => (
          <p key={i} style={{ color: m.sender === "user" ? "blue" : "green" }}>
            <b>{m.sender}:</b> {m.text}
          </p>
        ))}
      </div>
      <input
        style={{ width: "80%", marginRight: 5 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Wyślij</button>
    </div>
  );
}
