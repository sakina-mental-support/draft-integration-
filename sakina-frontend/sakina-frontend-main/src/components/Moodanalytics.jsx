import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMoods } from "../services/api";

// ── Mock data per tab ──────────────────────────────────────────────────────────
const DATA = {
  Day: {
    label: "Daily Mood Trend",
    trend: "+5% vs yesterday",
    trendUp: true,
    overall: "Calm",
    points: [55, 60, 52, 70, 65, 80, 72],
    labels: ["6AM","9AM","12PM","3PM","6PM","9PM","12AM"],
    feelings: [
      { emoji: "😌", label: "Calm",    count: 3, color: "#71BCFF" },
      { emoji: "😊", label: "Joyful",  count: 2, color: "#FCD34D" },
      { emoji: "😰", label: "Anxious", count: 1, color: "#F97316" },
      { emoji: "⚡", label: "Focused", count: 1, color: "#A78BFA" },
    ],
    insight: "Your mood stays most stable in the afternoon. Morning anxiety tends to fade after 9AM — consider a short breathing exercise right after waking.",
  },
  Week: {
    label: "Weekly Mood Trend",
    trend: "+12% vs last week",
    trendUp: true,
    overall: "Great",
    points: [45, 60, 55, 75, 65, 80, 70],
    labels: ["MON","TUE","WED","THU","FRI","SAT","SUN"],
    feelings: [
      { emoji: "😊", label: "Joyful",   count: 4, color: "#FCD34D" },
      { emoji: "😌", label: "Calm",     count: 3, color: "#71BCFF" },
      { emoji: "🎯", label: "Focused",  count: 2, color: "#A78BFA" },
      { emoji: "⚡", label: "Energetic",count: 2, color: "#34D399" },
    ],
    insight: "Your mood typically peaks after your morning meditation sessions. Try scheduling your most demanding tasks between 10 AM and 12 PM when your 'Joy' and 'Focus' levels are highest.",
  },
  Month: {
    label: "Monthly Mood Trend",
    trend: "+8% vs last month",
    trendUp: true,
    overall: "Positive",
    points: [50, 45, 60, 55, 70, 65, 75, 68, 80, 72, 78, 82],
    labels: ["W1","","W2","","W3","","W4","","","","",""],
    feelings: [
      { emoji: "😊", label: "Joyful",   count: 14, color: "#FCD34D" },
      { emoji: "😌", label: "Calm",     count: 10, color: "#71BCFF" },
      { emoji: "🎯", label: "Focused",  count: 7,  color: "#A78BFA" },
      { emoji: "😢", label: "Sad",      count: 3,  color: "#93C5FD" },
    ],
    insight: "You've had your most positive month yet! Weeks 3 and 4 showed consistent improvement. Maintaining your journaling habit seems to correlate with better mood scores.",
  },
};

// ── Simple SVG line chart ──────────────────────────────────────────────────────
const MoodChart = ({ points, labels }) => {
  const W = 310, H = 100;
  const min = Math.min(...points) - 10;
  const max = Math.max(...points) + 10;
  const n = points.length;

  const x = (i) => (i / (n - 1)) * W;
  const y = (v) => H - ((v - min) / (max - min)) * H;

  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M ${x(i)} ${y(p)}`;
      const cpx = (x(i) + x(i - 1)) / 2;
      return `C ${cpx} ${y(points[i - 1])}, ${cpx} ${y(p)}, ${x(i)} ${y(p)}`;
    })
    .join(" ");

  const fillD = `${pathD} L ${x(n - 1)} ${H} L 0 ${H} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`-4 -4 ${W + 8} ${H + 28}`} width="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#71BCFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#71BCFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <path d={fillD} fill="url(#chartFill)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#71BCFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p)} r="3.5" fill="#71BCFF" stroke="white" strokeWidth="1.5" />
        ))}
        {/* Labels */}
        {labels.map((l, i) => (
          l ? (
            <text key={i} x={x(i)} y={H + 20} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="sans-serif">
              {l}
            </text>
          ) : null
        ))}
      </svg>
    </div>
  );
};

// ── Mood level labels ─────────────────────────────────────────────────────────
const MOOD_LABELS = {
  5: { emoji: "😊", label: "Happy",   color: "#FCD34D" },
  4: { emoji: "😌", label: "Calm",    color: "#71BCFF" },
  3: { emoji: "🎯", label: "Focused", color: "#A78BFA" },
  2: { emoji: "😰", label: "Anxious", color: "#F97316" },
  1: { emoji: "😢", label: "Sad",     color: "#93C5FD" },
};

// ── Process moods from API into chart data ────────────────────────────────────
const processMoods = (moods) => {
  if (!moods || moods.length === 0) return null;

  // Calculate feeling counts
  const countMap = {};
  moods.forEach((m) => {
    const level = m.moodLevel;
    countMap[level] = (countMap[level] || 0) + 1;
  });

  const feelings = Object.entries(countMap)
    .map(([level, count]) => {
      const meta = MOOD_LABELS[level] || MOOD_LABELS[3];
      return { ...meta, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Recent mood points (last 7)
  const recent = moods.slice(0, 7).reverse();
  const points = recent.map((m) => m.moodLevel * 20); // scale 1-5 → 20-100
  const labels = recent.map((m) => {
    const d = new Date(m.createdAt);
    return d.toLocaleDateString("en", { weekday: "short" }).toUpperCase();
  });

  // Average mood
  const avg = moods.reduce((s, m) => s + m.moodLevel, 0) / moods.length;
  const overallLabel = avg >= 4 ? "Great" : avg >= 3 ? "Good" : avg >= 2 ? "OK" : "Low";

  return {
    label: "Your Mood Trend",
    trend: `${moods.length} entries`,
    trendUp: avg >= 3,
    overall: overallLabel,
    points: points.length > 1 ? points : [50, 50],
    labels: labels.length > 1 ? labels : ["", ""],
    feelings,
    insight: `Based on your ${moods.length} mood entries, your average mood level is ${avg.toFixed(1)}/5. Keep tracking to discover more patterns!`,
  };
};

// ── Main Component ─────────────────────────────────────────────────────────────
const MoodAnalytics = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Week");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await getMoods(1, 100);
        const processed = processMoods(res.data);
        if (processed) setApiData(processed);
      } catch (err) {
        // Silently fall back to mock data
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  // Use API data when available, otherwise fall back to mock DATA
  const d = apiData || DATA[tab];

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() => navigate("/mood")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Mood Analytics</h1>
            </div>
            <p className="text-gray-500 font-medium ml-13">Discover patterns in your emotional well-being.</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 w-full md:w-auto self-start">
            {["Day", "Week", "Month"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 md:w-28 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                  tab === t ? "bg-white text-[#71BCFF] shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">{d.label}</p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-extrabold text-gray-900">{d.overall}</p>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${d.trendUp ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
                    {d.trendUp ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 13.414 14.586 17H12z" clipRule="evenodd" /></svg>
                    )}
                    {d.trend}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#71BCFF]"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Energy</span>
                </div>
              </div>
            </div>
            
            <div className="h-[250px] w-full flex items-end">
              <MoodChart points={d.points} labels={d.labels} />
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Top Feelings */}
            <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Feelings</h3>
              <div className="space-y-4">
                {d.feelings.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${f.color}22` }}
                    >
                      {f.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-gray-800">{f.label}</p>
                        <p className="text-xs font-bold text-gray-400">{f.count} entries</p>
                      </div>
                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${(f.count / d.feelings.reduce((s, x) => s + x.count, 0)) * 100}%`,
                            backgroundColor: f.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-gray-900 p-8 shadow-xl relative overflow-hidden" style={{ borderRadius: '32px' }}>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#71BCFF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Sakina AI Insight</h3>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium mb-6 italic opacity-90">
                  "{d.insight}"
                </p>
                <button
                  type="button"
                  className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-4 rounded-2xl transition-all border border-white/20 active:scale-[0.98]"
                >
                  Get Personal Plan
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#71BCFF]/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Bottom Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
           <div className="bg-white p-6 shadow-sm flex items-center gap-5" style={{ borderRadius: '24px' }}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl font-bold">
                {d.feelings[0]?.emoji || "✨"}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dominant Mood</p>
                <p className="text-lg font-bold text-gray-800">{d.feelings[0]?.label || "Stable"}</p>
              </div>
           </div>
           <div className="bg-white p-6 shadow-sm flex items-center gap-5" style={{ borderRadius: '24px' }}>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl font-bold">
                📈
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Rate</p>
                <p className="text-lg font-bold text-gray-800">{d.trendUp ? "+15.4%" : "-2.1%"}</p>
              </div>
           </div>
           <div className="bg-white p-6 shadow-sm flex items-center gap-5" style={{ borderRadius: '24px' }}>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#71BCFF] flex items-center justify-center text-2xl font-bold">
                🗓️
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Streak</p>
                <p className="text-lg font-bold text-gray-800">{d.points.length} Days Tracking</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;