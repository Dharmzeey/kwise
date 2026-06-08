"use client";

interface Props {
  message: string | null;
}

export default function SwapToast({ message }: Props) {
  if (!message) return null;
  return <div className="swap-toast">{message}</div>;
}
