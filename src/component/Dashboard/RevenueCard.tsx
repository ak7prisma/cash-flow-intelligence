export default function RevenueCard() {
  return (
    <div className="relative overflow-hidden rounded-4xl w-auto text-slate-400 bg-blue-950 dark:bg-slate-900/20 p-5 py-8 flex flex-col gap-4 place-items-center shadow-xl">
      
      <div className="absolute -top-10 -right-10 size-32 bg-cyan-400/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 size-20 bg-cyan-300/10 blur-2xl rounded-full pointer-events-none" />

      <p className="relative z-10 tracking-widest font-medium text-xs text-cyan-400 dark:text-slate-400">
        TOTAL BALANCE
      </p>
      
      <span className="relative z-10 flex font-bold gap-2 items-end">
        <p className="text-base text-cyan-300">Rp </p>
        <p className="text-4xl text-slate-50">3.500.000</p>
      </span>
      
    </div>
  );
}