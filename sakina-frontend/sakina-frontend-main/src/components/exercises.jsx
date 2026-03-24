import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';
import { getExercises } from '../services/api';

const ExercisesPage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await getExercises();
                if (res.data && res.data.recommendations && Array.isArray(res.data.recommendations)) {
                    setExercises(res.data.recommendations);
                }
            } catch (err) {
                // Silently fall back to static content
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#111827] mb-2">Daily Recommendation</h1>
                    <p className="text-lg text-gray-500 font-medium">Personalized activities to help you stay balanced and mindful.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#71BCFF]/20 border-t-[#71BCFF] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold">Curating your exercises...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {exercises.length > 0 ? (
                            exercises.map((ex, index) => (
                                <div 
                                    key={ex._id || index} 
                                    className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50 flex flex-col h-full active:scale-[0.98]"
                                >
                                    <div className="h-[220px] w-full overflow-hidden relative">
                                        <img
                                            src={ex.imageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                            alt={ex.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-[10px] font-bold text-[#71BCFF] uppercase tracking-widest shadow-sm">
                                            {ex.category || "Mindfulness"}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        {index === 0 && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] uppercase font-bold tracking-widest rounded-full mb-4 w-fit">
                                                <span>⭐</span> Top Pick
                                            </div>
                                        )}
                                        <h2 className="text-[22px] font-bold text-[#111827] mb-2 group-hover:text-[#71BCFF] transition-colors">{ex.title}</h2>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#71BCFF]"></div>
                                            <p className="text-sm font-bold text-gray-400">{ex.duration || "5"} Minutes</p>
                                        </div>
                                        <p className="text-gray-500 leading-relaxed mb-8 flex-1 line-clamp-3">
                                            {ex.description}
                                        </p>
                                        <button
                                            onClick={() => navigate("/exercise-detail", { state: { exercise: ex } })}
                                            className="w-full bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 group-hover:shadow-blue-200"
                                        >
                                            <span>Start Session</span>
                                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Fallback cards with same styling if no data */
                            [1,2,3,4].map((item) => (
                                <div key={item} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50 flex flex-col h-full opacity-60">
                                    <div className="h-[220px] w-full bg-gray-100 flex items-center justify-center text-gray-300">
                                         No Exercises Found
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="h-6 w-3/4 bg-gray-100 rounded-lg mb-4"></div>
                                        <div className="h-4 w-1/2 bg-gray-50 rounded-lg mb-4"></div>
                                        <div className="h-20 w-full bg-gray-50 rounded-lg mb-8"></div>
                                        <div className="h-12 w-full bg-gray-100 rounded-2xl"></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExercisesPage;