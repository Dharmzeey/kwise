"use client";
import Link from "next/link";
import Icon from "./Icon";

type BtnKind = "primary" | "orange" | "ghost" | "outline";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  children?: React.ReactNode;
  kind?: BtnKind;
  size?: BtnSize;
  icon?: string;
  iconAfter?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  full?: boolean;
  className?: string;
}

export default function Btn({
  children, kind = "primary", size = "md", icon, iconAfter,
  onClick, href, type, disabled, full, className = "",
}: BtnProps) {
  const iconSize = size === "lg" ? 20 : 17;
  const cls = `btn btn-${kind} btn-${size}${full ? " btn-full" : ""} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} size={iconSize} />}
      {children && <span>{children}</span>}
      {iconAfter && <Icon name={iconAfter} size={iconSize} />}
    </>
  );

  if (href) {
    return <Link className={cls} href={href}>{content}</Link>;
  }
  return (
    <button className={cls} type={type ?? "button"} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
