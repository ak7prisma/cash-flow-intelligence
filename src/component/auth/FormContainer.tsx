interface FormContainerProps {
    children: React.ReactNode,
}

export const FormContainer = ({ children } : FormContainerProps) => {
  return (
    <form className="flex flex-col justify-center gap-5 w-full">
      {children}
    </form>
  );
};