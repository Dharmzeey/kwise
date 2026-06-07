"use client";

/**
 * Kwise World — Icon component.
 * Backed by Lucide React — consistent, high-quality, tree-shakeable icons.
 */

import {
  Phone,
  Laptop,
  Zap,
  BatteryCharging,
  Cable,
  ShieldCheck,
  Battery,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Heart,
  Check,
  Minus,
  Plus,
  Trash2,
  Truck,
  Tag,
  RefreshCcw,
  MapPin,
  Mail,
  SlidersHorizontal,
  Info,
  LayoutGrid,
  BarChart2,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";


const ICON_MAP: Record<string, LucideIcon> = {
  // Product / category
  phone:       Phone,
  laptop:      Laptop,
  charger:     BatteryCharging,
  powerbank:   Battery,
  cable:       Cable,
  case:        ShieldCheck,
  battery:     Battery,
  accessories: Tag,
  grid:        LayoutGrid,

  // Navigation & UI
  search:      Search,
  cart:        ShoppingCart,
  user:        User,
  menu:        Menu,
  close:       X,
  x:           X,
  star:        Star,
  chevron:     ChevronRight,
  chevronDown: ChevronDown,
  chevronRight:ChevronRight,
  arrowRight:  ArrowRight,
  arrowLeft:   ArrowLeft,

  // Actions
  heart:       Heart,
  check:       Check,
  minus:       Minus,
  plus:        Plus,
  trash:       Trash2,
  refresh:     RefreshCcw,
  sliders:     SlidersHorizontal,
  info:        Info,

  // Trust / contact
  truck:       Truck,
  shieldCheck: ShieldCheck,
  shield:      ShieldCheck,
  bolt:        Zap,
  tag:         Tag,
  pin:         MapPin,
  mail:        Mail,
  whatsapp:    MessageCircle,

  // Admin
  chart:       BarChart2,

};

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Icon({ name, size = 22, stroke = 1.7, className = "", style }: IconProps) {
  const LucideComponent = ICON_MAP[name];
  if (!LucideComponent) return null;

  return (
    <LucideComponent
      size={size}
      strokeWidth={stroke}
      className={"icon " + className}
      style={style}
      aria-hidden="true"
    />
  );
}
