"use client"
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

function AuthHandler({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user?.role === 'admin' && !window.location.pathname.startsWith('/admin')) {
      router.replace('/admin');
    }
  }, [user, router]);
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          <AuthHandler>
            <Navbar />
            {children}
          </AuthHandler>
        </AuthProvider>
      </body>
    </html>
  );
}