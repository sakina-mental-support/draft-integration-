import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSurvey } from "../services/api";

const CATEGORIES = {
  activities: [
    "Reading", "Meditation", "Gaming", "Exercise", "Cooking", 
    "Walking", "Music", "Art", "Writing", "Cycling"
  ],
  triggers: [
    "Work Stress", "Social Pressure", "Lack of Sleep", "Financial Worries",
    "Health Issues", "Loneliness", "Loud Environments", "Deadline Pressure"
  ],
  coping: [
    "Deep Breathing", "Talking to Friends", "Listening to Music",
    "Physical Activity", "Creative Hobbies", "Quiet Time", "Professional Help"
  ]
};

const Survey = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    favoriteActivities: [],
    stressTriggers: [],
    copingMethods: [],
    sleepQuality: 7,
    socialLevel: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSelection = (category, item) => {
    setFormData(prev => {
      const field = category === 'activities' ? 'favoriteActivities' : 
                    category === 'triggers' ? 'stressTriggers' : 'copingMethods';
      const current = prev[field];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createSurvey(formData);
      navigate("/exercises"); // Navigate to exercises after survey
    } catch (err) {
      setError(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Chip = ({ label, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
        isSelected 
          ? "bg-[#71BCFF] border-[#71BCFF] text-white shadow-md shadow-blue-100 scale-105" 
          : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Tell us about yourself</h1>
          <p className="text-gray-500 font-medium text-lg">Your answers help us personalize your Sakina experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Multi-select Sections */}
          {[
            { id: 'activities', title: 'What are your favorite activities?', field: 'favoriteActivities', data: CATEGORIES.activities },
            { id: 'triggers', title: 'What usually triggers your stress?', field: 'stressTriggers', data: CATEGORIES.triggers },
            { id: 'coping', title: 'How do you currently cope with stress?', field: 'copingMethods', data: CATEGORIES.coping }
          ].map((section) => (
            <div key={section.id} className="bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
              <h2 className="text-xl font-extrabold text-gray-800 mb-6">{section.title}</h2>
              <div className="flex flex-wrap gap-3">
                {section.data.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    isSelected={formData[section.field].includes(item)}
                    onClick={() => toggleSelection(section.id, item)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Slider Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-gray-800">Sleep Quality</h2>
                <span className="text-[#71BCFF] text-2xl font-black">{formData.sleepQuality}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sleepQuality}
                onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#71BCFF]"
              />
              <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '32px' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-gray-800">Social Level</h2>
                <span className="text-[#71BCFF] text-2xl font-black">{formData.socialLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.socialLevel}
                onChange={(e) => setFormData({ ...formData, socialLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#71BCFF]"
              />
              <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Introvert</span>
                <span>Extrovert</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-3xl font-bold flex items-center gap-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-20 bg-[#71BCFF] text-white text-xl font-black rounded-3xl transition-all flex items-center justify-center gap-4 shadow-lg shadow-blue-100 active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5aadf0]"
            }`}
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Complete Survey
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
