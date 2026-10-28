import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Home | Cumpliendo",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
