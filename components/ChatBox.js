import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // 🔎 Debug: sprawdź URL backendu
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log("🔗 Backend URL użyty w fetch:", backendUrl);

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "frontend-user", text: input }),
      });

      if (!res.ok) {
        console.error("❌ Błąd odpowiedzi backendu:", res.status, res.statusText);
        setMessages((prev) => [
          ...prev,
          { sender: "lena", text: `Błąd: ${res.status} ${res.statusText}` },
        ]);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "lena", text: data.reply },
      ]);
    } catch (err) {
      console.error("❌ Błąd fetch:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "lena", text: "Nie udało się połączyć z backendem." },
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
