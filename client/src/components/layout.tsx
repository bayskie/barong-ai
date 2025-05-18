import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex w-full flex-col items-center py-8">
        {/* Header */}
        <header className="bg-background fixed top-0 right-0 left-0 flex h-20 items-center gap-4 border-b px-4 shadow-xs">
          <div className="logo relative z-20 flex items-center gap-2">
            <Logo />
          </div>

          <div className="from-background absolute inset-0 z-10 bg-gradient-to-r via-transparent to-transparent"></div>
          <div className="absolute inset-0 z-0 bg-[url('/image/balinese-pattern-violet.svg')] bg-[length:560px] bg-repeat opacity-7.5"></div>
        </header>

        {/* Theme Toggle */}
        <ThemeToggle className="fixed top-24 right-4 z-10" />

        <main className="mt-20">{children}</main>

        {/* Background */}
        <div className="fixed right-0 bottom-0 left-0 -z-10 h-1/2 bg-[url('/image/balinese-pattern-violet.svg')] bg-[length:560px] bg-repeat opacity-7.5" />
        <div className="from-background fixed right-0 bottom-0 left-0 -z-10 h-1/2 bg-gradient-to-b via-transparent to-transparent" />
      </div>
    </>
  );
}
