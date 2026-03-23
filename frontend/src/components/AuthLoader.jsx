const AuthLoader = ({ status = "Please wait..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-[Inter]">
      <div className="text-center animate-[fadeUp_0.6s_ease_forwards] px-6">
        <div className="text-4xl mb-2 animate-pulse">🩸</div>
        <div className="text-[22px] font-black text-[#B91C1C] tracking-tight mb-8">
          RedThread
        </div>

        <div className="bg-white rounded-2xl px-10 py-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[#f0f0f0] min-w-[280px] max-w-[340px] mx-auto">
          <div className="w-12 h-12 border-[3px] border-[#fecaca] border-t-[#B91C1C] rounded-full animate-spin mx-auto mb-5" />

          <div className="text-[15px] font-semibold text-black mb-2 tracking-tight">
            {status}
          </div>

          <div className="text-[13px] text-gray-400 mb-6">
            Please wait a moment
          </div>

          <div className="bg-[#f5f5f5] rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#B91C1C] to-[#ef4444] rounded-full animate-[progressAnim_2.5s_ease_forwards]" />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes progressAnim {
          from { width: 0%; }
          to { width: 85%; }
        }
      `}</style>
    </div>
  );
};

export default AuthLoader;