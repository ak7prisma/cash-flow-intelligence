import { contact } from "../../../data/contact";
import { IconUI } from "../../ui/IconUI";

export default function ContactSection() {
    return (
        <section className="flex flex-col items-center">
            <h3 className="text-md font-bold text-slate-500 tracking-widest uppercase">
            Contact Support
            </h3>
            <div className="flex items-center justify-center gap-2 py-2 w-full bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
            {contact.map((social) => (
                <a 
                key={social.id} 
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-600 dark:text-cyan-400 transition-all active:scale-90"
                >
                <IconUI Icon={social.icon} />
                </a>
            ))}
            </div>
        </section>
    );
}