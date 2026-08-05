"use client";

import { useState } from "react";

export default function AIAssistantClient() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const askAI = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setReply("");
      } else {
        setReply(data.reply);
        setHistory([...history, { question: input, answer: data.reply }]);
        setInput("");
      }
    } catch (err) {
      setError("Failed to connect to AI service");
      setReply("");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    askAI();
  };

  return (
    <div className="w-full flex-1 bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-1 flex items-center gap-3">
            AI Auditor Assistant
          </h1>
          <p className="text-gray-600 text-base">
            Ask security, vulnerability, and ISO 27001 audit questions (powered by AI)
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="question" className="block text-sm font-semibold text-black">
              Your Question
            </label>
            <textarea
              id="question"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none transition text-sm text-gray-900"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., What are the risks of SQL injection? How do I implement 2FA?..."
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Thinking...
                  </>
                ) : (
                  <>
                    Ask AI
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* AI Response Card */}
        {reply && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-black">AI Response</h2>
            </div>
            <div className="bg-gray-50 border-l-4 border-black p-4 rounded text-black whitespace-pre-wrap leading-relaxed text-sm font-sans">
              {reply}
            </div>
          </div>
        )}

        {/* Conversation History */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              Conversation History
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {history.map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0 space-y-1">
                  <p className="text-sm font-semibold text-black">
                    Q{idx + 1}: {item.question}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-100">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
