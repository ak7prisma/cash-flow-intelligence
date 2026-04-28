interface StackIconProps {
   Icon: React.ComponentType<any>;
}

export const StackIcon = ({ Icon }: StackIconProps) => (
  <div className="w-11 h-11 rounded-lg bg-teal-50 dark:bg-cyan-950/30 flex items-center justify-center text-teal-800 dark:text-cyan-400 shadow-sm">
    <Icon size={20} />
  </div>
);