interface PrivacyProps {
  number: string; 
  title: string; 
  content: string
}

export default function PrivacySection({ number, title, content }: Readonly<PrivacyProps>) {
  return (
    <div className="flex flex-col gap-2 group">
      <h2 className="text-xl font-bold text-teal-800 dark:text-cyan-400 flex items-center gap-2 transition-transform">
        <span className="text-blue-950 dark:text-white opacity-90">{number}.</span> {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
        {content}
      </p>
    </div>
  );
}