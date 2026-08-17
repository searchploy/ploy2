import {
  TrendingUp,
  Megaphone,
  Headset,
  Landmark,
  Settings2,
  Users,
  UserSearch,
  Scale,
  HeartPulse,
  Building2,
  ShoppingCart,
  HardHat,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Headset,
  Landmark,
  Settings2,
  Users,
  UserSearch,
  Scale,
  HeartPulse,
  Building2,
  ShoppingCart,
  HardHat,
  DollarSign,
};

export function CategoryIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && iconMap[name]) || Settings2;
  return <Icon className={className} />;
}
