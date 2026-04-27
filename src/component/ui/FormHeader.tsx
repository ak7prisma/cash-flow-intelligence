interface FormHeaderProps {
    title: string,
    subtitle: string,
}

export default function FormHeader ({ title, subtitle }: Readonly<FormHeaderProps>) {
  return (
    <div>
      <h2 className="text-2xl font-black text-blue-950 dark:text-white mb-3 tracking-wider uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};