import { Logo } from "@/components/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AppMode = "analyze" | "compare";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="border-b border-border/50 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight font-headline text-foreground">
            LegalLens
          </h1>
        </div>
        <div>
          <Tabs value={mode} onValueChange={(value) => onModeChange(value as AppMode)}>
            <TabsList>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
}