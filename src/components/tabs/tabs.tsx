// components/ui/tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  href: string;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export default function Tabs({ items, className }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            pathname.startsWith(item.href)
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}