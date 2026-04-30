import Logo from "../ui/Logo";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: Readonly<AuthHeaderProps>) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <Logo showText={false} size="md" className="mb-4" />
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-950 dark:text-cyan-400 uppercase mb-1">
          {title}
        </h2>
        <p className="text-xs font-semibold text-slate-500 dark:text-cyan-400 tracking-widest uppercase">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
