import { ReactNode } from 'react';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
