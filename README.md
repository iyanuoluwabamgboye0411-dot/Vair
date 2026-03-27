# Vair
Tech
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// =========================
// MOCK AUTH (replace with Firebase later)
// =========================
function useAuth() {
  const [user, setUser] = useState(null);
  const login = (email) => setUser({ email });
  const logout = () => setUser(null);
  return { user, login, logout };
}

export default function VairApp() {
  const [dark, setDark] = useState(true);
  const { user, login, logout } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleAI = async () => {
    if (!prompt) return;

    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.result },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to AI" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-500">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <img src="/vair-logo.png" className="w-10 h-10 rounded-xl" />
          <h1 className="text-2xl font-bold">VAIR</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => setDark(!dark)} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded">
            {dark ? "Light" : "Dark"}
          </button>

          {user ? (
            <button onClick={logout} className="px-4 py-2 bg-red-500 rounded-xl">Logout</button>
          ) : (
            <button onClick={() => login("user@vair.com")} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black rounded-xl">
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-10">
        <motion.h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          VAIR AI Platform
        </motion.h1>
      </section>

      {/* AI Chat */}
      <section className="p-6 max-w-2xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl h-[400px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className="block p-3 rounded-xl bg-white dark:bg-black inline-block">
                {msg.content}
              </span>
            </div>
          ))}
          {loading && <p>Thinking...</p>}
        </div>

        <div className="flex mt-4 space-x-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-800"
            placeholder="Ask VAIR..."
          />
          <button onClick={handleAI} className="px-6 bg-blue-500 rounded-xl text-white">
            Send
          </button>
        </div>
      </section>

      {/* Dashboard */}
      {user && (
        <section className="p-10">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">Users: 120</div>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">Revenue: $230</div>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">Requests: 1.2k</div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Free", "Pro $10", "Business $49"].map((plan, i) => (
            <div key={i} className="p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl">
              <h3 className="text-xl font-bold">{plan}</h3>
              <button className="mt-4 px-4 py-2 bg-green-400 text-black rounded-xl">Subscribe</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-500">© {new Date().getFullYear()} VAIR</footer>
    </div>
  );
}

/* =========================
 LAUNCH CHECKLIST 🚀
=========================

1. Backend (Node/Next API)
2. Add OpenAI API key
3. Add Stripe payments
4. Add Firebase auth
5. Deploy frontend (Vercel)
6. Buy domain (e.g. vair.ai)
7. Launch 🔥

YOU ARE READY.
*/
