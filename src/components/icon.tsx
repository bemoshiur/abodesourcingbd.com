import {
  Headset, Factory, BadgeDollarSign, Truck, ShieldCheck, MessagesSquare,
  Lightbulb, Scaling, Leaf, Spool, ClipboardList, Activity, Shirt, Scissors,
  Wind, HardHat, ArrowRight, ArrowUpRight, Check, Mail, Phone, MapPin,
  ExternalLink, ChevronRight, Menu, X, Globe, PackageCheck, Send,
  Clock, Lock, LoaderCircle, CircleCheck, CircleAlert,
  type LucideIcon,
} from "lucide-react";

/** Central registry so content arrays can name icons as plain strings. */
const registry: Record<string, LucideIcon> = {
  Headset, Factory, BadgeDollarSign, Truck, ShieldCheck, MessagesSquare,
  Lightbulb, Scaling, Leaf, Spool, ClipboardList, Activity, Shirt, Scissors,
  Wind, HardHat, ArrowRight, ArrowUpRight, Check, Mail, Phone, MapPin,
  ExternalLink, ChevronRight, Menu, X, Globe, PackageCheck, Send,
  Clock, Lock, LoaderCircle, CircleCheck, CircleAlert,
};

export function Icon({
  name,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  name: string;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const Cmp = registry[name] ?? Shirt;
  return <Cmp className={className} aria-hidden={ariaHidden} />;
}
