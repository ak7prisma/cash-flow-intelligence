export default function BackgroundElement(){
    return(
        <>
            <div className="fixed -top-20 -left-20 size-80 rounded-full blur-[100px] opacity-20 pointer-events-none z-0 bg-teal-800 dark:bg-cyan-400" />
            <div className="fixed top-1/2 -right-20 size-96 rounded-full blur-[120px] opacity-15 pointer-events-none z-0 bg-teal-800 dark:bg-cyan-400" />
        </>
    );
}