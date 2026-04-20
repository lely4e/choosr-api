export const Tooltip = ({ text }: { text: string }) => (
    <span
        className="absolute bottom-[80%] left-1/2 -translate-x-1/2 bg-[#737791]
     text-white px-2.5 py-1.5 rounded text-xs opacity-0 invisible group-hover:opacity-100 
     group-hover:visible transition-opacity duration-200 pointer-events-none z-10 max-w-75
     text-center whitespace-normal"
    >
        {text}
    </span>
);