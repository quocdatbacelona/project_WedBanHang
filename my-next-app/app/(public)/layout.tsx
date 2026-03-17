// Địa chỉ file: app/(public)/layout.tsx
"use client";

import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}