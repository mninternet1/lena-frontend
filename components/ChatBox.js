import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input, user_id: "ignored" }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "lena", text: `Błąd: ${res.status}` },
        ]);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "lena", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "lena", text: "❌ Brak połączenia z backendem" },
      ]);
    }

    setInput("");
  };

  return (
    <div>
      <div>
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
