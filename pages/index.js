import { useState } from "react";
import Login from "../components/Login";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(
    typeof window !== "undefined" && localStorage.getItem("token")
  );

  return (
    <div>
      <h1>Lena Chat</h1>
      {!loggedIn ? (
        <Login onLogin={() => setLoggedIn(true)} />
      ) : (
        <ChatBox />
      )}
    </div>
  );
}
