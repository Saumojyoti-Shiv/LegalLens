import { LegalLensClient } from '@/components/legallens/legallens-client';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LegalLensClient />
    </main>
  );
}