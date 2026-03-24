import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExerciseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const exercise = location.state?.exercise;

    // Use default values if no exercise was passed (directly navigated)
    const data = exercise || {
        title: "Mindfulness Session",
        category: "Meditation",
        duration: "10",
        description: "A focused session to help you center your thoughts and find inner peace.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Find a quiet space, sit in a comfortable position, and focus on your breath. Notice any thoughts as they arise and gently let them go."
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FBFF] p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                
                {/* Visual Section - Left (Desktop) / Top (Mobile) */}
                <div className="w-full lg:w-2/5 relative h-[300px] lg:h-auto min-h-[400px]">
                    <img
                        src={data.imageUrl}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="inline-flex items-center px-4 py-1.5 bg-[#71BCFF] text-white text-[11px] uppercase font-bold tracking-widest rounded-full mb-4 shadow-lg shadow-blue-500/20">
                            {data.category}
                        </div>
                        <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
                            {data.title}
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/exercises")}
                        className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#71BCFF] transition-all duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Content Section - Right (Desktop) / Bottom (Mobile) */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                    <div>
                        {/* Stats Summary */}
                        <div className="flex flex-wrap items-center gap-8 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#71BCFF]/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#71BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#111827]">{data.duration}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minutes</p>
                                </div>
                            </div>
                            
                            <div className="w-px h-10 bg-gray-100 hidden sm:block" />

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#71BCFF]/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#71BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#111827]">Beginner</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level</p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mb-12">
                            <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#71BCFF] rounded-full"></span>
                                About this session
                            </h3>
                            <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                {data.description}
                            </p>
                        </div>

                        {/* Guide Section */}
                        <div className="mb-12 bg-gray-50/50 p-8 rounded-[32px] border border-gray-50">
                            <h3 className="text-lg font-bold text-[#111827] mb-6">Preparation Guide</h3>
                            <div className="space-y-6">
                                {(data.content || "Steps provided during the session.").split('.').filter(s => s.trim().length > 0).map((step, i) => (
                                    <div key={i} className="flex items-start gap-5">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-[#71BCFF] text-[#71BCFF] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-600 font-medium pt-1">{step.trim()}.</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex gap-4">
                        <button
                            className="flex-1 bg-[#71BCFF] hover:bg-[#5aadf0] text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 text-lg"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetail;