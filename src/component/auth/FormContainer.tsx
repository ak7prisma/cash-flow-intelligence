interface FormContainerProps {
    children: React.ReactNode,
    onSubmit?: (e: React.FormEvent) => void,
}

export const FormContainer = ({ children, onSubmit } : FormContainerProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-5 w-full">
      {children}
    </form>
  );
};