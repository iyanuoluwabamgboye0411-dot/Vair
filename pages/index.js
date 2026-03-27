import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function VairApp() {
  const [dark, setDark] = useState(true);
  const { user, login, logout, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleAI = async () => {
    if (!prompt.trim()) return;
    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    setPrompt("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.result }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Error: " + (data.error || "Unknown error") }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Error connecting to AI: " + err.message }]);
    }

    setAiLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-500">
      <nav className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">VA</span>
          </div>
          <h1 className="text-2xl font-bold">VAIR</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setDark(!dark)} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition">Logout</button>
            </div>
          ) : (
            <button onClick={() => login("user@vair.com")} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-black font-semibold rounded-xl hover:shadow-lg transition">Login</button>
          )}
        </div>
      </nav>
      <section className="text-center py-16">
        <motion.h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          VAIR AI Platform
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Chat with advanced AI powered by cutting-edge technology</p>
      </section>
      <section className="p-6 max-w-3xl mx-auto pb-20">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Start a conversation with VAIR...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}> 
                <div className={`max-w-xs px-4 py-2 rounded-xl ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"}`}>{msg.content}</div>
              </motion.div>
            )))
          }
          {aiLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAI()} disabled={aiLoading} className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" placeholder="Ask VAIR anything..."/>
          <button onClick={handleAI} disabled={aiLoading || !prompt.trim()} className="px-6 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
            {aiLoading ? "..." : "Send"}
          </button>
        </div>
      </section>
      {user && (
        <section className="p-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[{ label: "Active Users", value: "120", color: "from-blue-500" }, { label: "Revenue", value: "$2,340", color: "from-green-500" }, { label: "API Requests", value: "12.5K", color: "from-purple-500" }].map((stat, i) => (
                <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }} className={`p-6 bg-gradient-to-br ${stat.color} to-transparent rounded-2xl`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Simple Pricing</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10">Choose the perfect plan for your needs</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[{ name: "Free", price: "$0", features: ["100 messages/month", "Basic AI", "Community support"] }, { name: "Pro", price: "$10", features: ["Unlimited messages", "Advanced AI", "Email support", "API access"], highlight: true }, { name: "Business", price: "$49", features: ["Everything in Pro", "Priority support", "Custom integrations", "Dedicated account manager"] }].map((plan, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }} className={`p-6 rounded-2xl ${plan.highlight ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-xl scale-105" : "bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"}`}> 
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-bold my-2">{plan.price}</p>
              <p className="text-sm opacity-75 mb-4">/month</p>
              <ul className="text-left mb-6 space-y-2 text-sm">{plan.features.map((feature, j) => (<li key={j}>✓ {feature}</li>))}</ul>
              <button className={`w-full py-2 rounded-xl font-semibold transition ${plan.highlight ? "bg-white text-blue-500 hover:bg-gray-100" : "bg-blue-500 text-white hover:bg-blue-600"}`}>Subscribe Now</button>
            </motion.div>
          ))}
        </div>
      </section>
      <footer className="text-center p-6 text-gray-500 border-t border-gray-200 dark:border-gray-800 mt-10">
        <p>© {new Date().getFullYear()} VAIR. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <a href="#" className="hover:text-blue-500">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500">Terms of Service</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>
      </footer>
    </div>
  );
}