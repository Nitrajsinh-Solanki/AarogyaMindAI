interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div
      className={`min-h-screen flex flex-col pb-20 ${className}`}
      style={{ background: "var(--bg-base)" }}
    >
      {children}
    </div>
  );
}
