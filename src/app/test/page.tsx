// app/(main)/tabs/page.tsx
import  Tabs  from "@/components/tabs/tabs";
import { ReactNode } from "react";

const tabItems = [
  {
    id: "tab1",
    label: "Tab 1",
    href: "/tabs/tab1",
  },
  {
    id: "tab2",
    label: "Tab 2",
    href: "/tabs/tab2",
  },
  {
    id: "tab3",
    label: "Tab 3",
    href: "/tabs/tab3",
  },
];

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <Tabs items={tabItems} />
      <div className="p-4 rounded-md border bg-background shadow-sm">
        {children}
      </div>
    </div>
  );
}