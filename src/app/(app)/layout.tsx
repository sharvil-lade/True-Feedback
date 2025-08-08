import Navbar from "@/components/Navbar";
import { Toaster } from '@/components/ui/toaster';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
}
