import React, { type ReactNode } from "react";

type NoteCardProps = {
  children: ReactNode;
  className?: string;
};

const NoteCard: React.FC<NoteCardProps> = ({ children, className = "" }) => {
  return (
    <div className="flex justify-left items-center w-full mt-2">
      
      <div
        className="w-fit max-w-[90%]"
        style={{
          filter: `
            drop-shadow(0px 2px 2px rgba(0,0,0,0.04))
            drop-shadow(0px 0px 0px rgba(0,0,0,0.12))
          `,
        }}
      >
        {/*  Masked paper */}
        <div
          className={`relative w-full bg-[#f4efe6] overflow-hidden p-3 ${className}`}
          style={{
            WebkitMaskImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0,0 H100 V85 Q95,90 90,85 T80,85 T70,85 T60,85 T50,85 T40,85 T30,85 T20,85 T10,85 T0,85 Z' fill='white'/></svg>\")",
            WebkitMaskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0,0 H100 V85 Q95,90 90,85 T80,85 T70,85 T60,85 T50,85 T40,85 T30,85 T20,85 T10,85 T0,85 Z' fill='white'/></svg>\")",
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
          }}
        >
          {/* Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full bg-[repeating-linear-gradient(to_bottom,transparent,transparent_32px,#cfd8dc_33px)] opacity-60"></div>
          </div>

          {/* Content */}
          <div className="relative z- wrap-break-word">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;