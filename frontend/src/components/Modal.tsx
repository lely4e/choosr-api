import { type ReactNode } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        onClose();
      }}
    >
      <div
        className="bg-white p-10 rounded-2xl"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

