import { useNavigate } from "react-router-dom";

export default function CreateCard() {
    const navigate = useNavigate();
  return (
    
    <>
      {/* create-card */}
      <div
        className="h-full box-content bg-white/[0.439] backdrop-blur-[10px] border-2 border-dashed 
        border-[#cbd5f5] rounded-[30px] p-6 flex flex-col items-center justify-center cursor-pointer
        transition-all duration-250 hover:border-[#F25E0D] hover:bg-[rgba(246,143,92,0.05)]"
        onClick={() => navigate("/add-poll")}
      >
        {/* create-icon */}
        <div className="w-14 h-14 flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-[#9496b8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        {/* create-title */}
        <p className="text-slate-600 mb-1 text-sm">Create Poll</p>
      </div>
    </>
  );
}