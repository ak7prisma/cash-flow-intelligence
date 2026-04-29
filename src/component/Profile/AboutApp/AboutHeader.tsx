export default function AboutHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-5 rounded-full bg-blue-950 dark:bg-slate-950 flex items-center justify-center mb-2 shadow-lg">
        <img src="/LogoCFI.png" alt="Logo CFI" className="w-15 h-15 object-contain brightness-150 dark:brightness-125"/>
      </div>
      <h2 className="text-3xl font-black text-blue-950 dark:text-cyan-400 tracking-widest">CASH FLOW INTELLIGENCE</h2>
      <p className="text-xs mt-3 text-blue-950 dark:text-cyan-400 tracking-widest font-medium uppercase">Version 1.0.0</p>
    </div>
  );
}
