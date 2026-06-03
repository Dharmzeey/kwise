"use client";
import Icon from "./Icon";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-ic"><Icon name="check" size={16} /></span>
      <span>{message}</span>
    </div>
  );
}
