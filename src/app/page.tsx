import Header from "./header/page";
import Main from "./main/page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 justify-between items-center gap-4 border-b bg-background px-6 md:gap-6">
        <Header />
      </header>
      <main className="flex-1 space-y-10 p-4 md:p-8">
        <Main/>
      </main>
    </div>
  );
}
