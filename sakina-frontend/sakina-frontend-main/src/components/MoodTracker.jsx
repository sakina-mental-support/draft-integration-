import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMood } from "../services/api";

const MOODS = [
  { id: "happy",   label: "Happy",   emoji: "😊", color: "#FCD34D" },
  { id: "calm",    label: "Calm",    emoji: "😌", color: "#71BCFF" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#F97316" },
  { id: "sad",     label: "Sad",     emoji: "😢", color: "#93C5FD" },
  { id: "angry",   label: "Angry",   emoji: "⚡", color: "#EF4444" },
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MOOD_LEVELS = { happy: 5, calm: 4, anxious: 2, sad: 1, angry: 1 };

const MoodTracker = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("calm");
  const [note, setNote] = useState("");
  const [selectedDay, setSelectedDay] = useState(5);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback({ type: "", message: "" });
    try {
      const moodLevel = MOOD_LEVELS[selectedMood];
      await createMood(moodLevel, note);
      setFeedback({ type: "success", message: "Mood saved successfully! ✅" });
      setNote("");
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to save mood." });
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = [
    [null, null, null, 1,  2,  3,  4],
    [5,   6,   7,   8,  9,  10, 11],
    [12,  13,  14,  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  ];

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
            <p className="text-gray-500 font-medium">How are you feeling today?</p>
          </div>
          <button 
            onClick={() => navigate("/mood-analytics")}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#71BCFF] text-[#71BCFF] font-bold rounded-2xl hover:bg-[#f0f8ff] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Mood Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Calendar (Card) */}
          <div className="lg:col-span-5 bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
            <div className="flex items-center justify-between mb-6">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-lg font-bold text-gray-700">October 2023</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {DAYS.map((d, i) => (
                <div key={i} className="text-center text-xs font-bold text-gray-300 py-1 uppercase tracking-wider">{d}</div>
              ))}
            </div>

            <div className="space-y-2">
              {calendarDays.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-2">
                  {week.map((day, di) => (
                    <div key={di} className="aspect-square flex items-center justify-center">
                      {day ? (
                        <button
                          onClick={() => setSelectedDay(day)}
                          className={`w-full h-full max-w-[42px] max-h-[42px] rounded-2xl text-sm font-bold transition-all duration-150 ${
                            selectedDay === day
                              ? "bg-[#71BCFF] text-white shadow-lg shadow-blue-100 scale-110"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">💡</div>
              <p className="text-sm text-blue-800 font-medium">Tracking your mood daily helps you understand your emotional patterns over time.</p>
            </div>
          </div>

          {/* Right Side: Mood Input (Card) */}
          <div className="lg:col-span-7 bg-white p-8 shadow-sm flex flex-col" style={{ borderRadius: '32px' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's your mood right now?</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-[#71BCFF] bg-[#f0f8ff] scale-105 shadow-md"
                        : "border-gray-50 bg-gray-50 hover:border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm"
                      style={{ backgroundColor: `${mood.color}22` }}
                    >
                      {mood.emoji}
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? "text-[#71BCFF]" : "text-gray-500"}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6 flex-1">
              <label className="text-sm font-bold text-gray-700 mb-3 block ml-1">Notes (Optional)</label>
              <textarea
                placeholder="What's on your mind? How was your day?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#71BCFF] focus:bg-white rounded-3xl text-gray-700 outline-none transition-all font-medium resize-none min-h-[150px]"
              />
            </div>

            {/* Feedback */}
            {feedback.message && (
              <div className={`mb-6 p-4 rounded-2xl text-sm font-bold border ${
                feedback.type === "success" 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                  : "bg-red-50 border-red-100 text-red-600"
              } animate-bounce`}>
                {feedback.message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full h-16 bg-[#71BCFF] text-white text-lg font-bold rounded-[22px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-blue-100 ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5aadf0]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Submit Daily Mood"
                )}
              </button>
              
              <button 
                onClick={() => navigate("/mood-analytics")}
                className="md:hidden flex items-center justify-center gap-2 w-full py-4 text-[#71BCFF] font-bold text-sm border-2 border-[#71BCFF] rounded-2xl"
              >
                View Mood Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;