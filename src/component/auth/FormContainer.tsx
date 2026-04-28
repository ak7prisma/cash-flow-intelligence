interface FormContainerProps {
    children: React.ReactNode,
}

export const FormContainer = ({ children } : FormContainerProps) => {
  return (
    <form className="flex flex-col justify-center gap-10 w-full">
      {children}
    </form>
  );
};