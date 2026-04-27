interface FormContainerProps {
    children: React.ReactNode,
}

export const FormContainer = ({ children } : FormContainerProps) => {
  return (
    <form className="flex flex-col justify-center gap-10 px-3 w-full bg-slate-50/20 dark:bg-slate-950/20">
      {children}
    </form>
  );
};