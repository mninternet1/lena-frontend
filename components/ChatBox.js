import { useState, useEffect } from "react";

// 🔹 Generujemy unikalny user_id (zapisany w localStorage)
function getUserId() {
  if (typeof window !== "undefined") {
    let uid = localStorage.getItem("user_id");
    if (!uid) {
      uid = "user-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("user_id", uid);
    }
    return uid;
  }
  return "unknown-user";
}

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, text: input }),
        }
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "lena", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "lena", text: "❌ Błąd połączenia z backendem." },
      ]);
    }

    setInput("");
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Napisz coś..."
      />
      <button onClick={sendMessage}>Wyślij</button>
    </div>
  );
}
