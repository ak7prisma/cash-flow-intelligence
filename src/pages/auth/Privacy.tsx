import PrivacySection from "../../component/auth/PrivacySection";
import ContactSection from "../../component/Profile/HelpSupp/ContactSection";
import { privacyData } from "../../data/privacy";

export default function Privacy() {
  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-950 dark:text-white">
          Privacy <span className="text-teal-800 dark:text-cyan-400">Policy</span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Learn how we handle your data through secure Firebase encryption and responsible AI processing to ensure a safe financial experience.
        </p>
      </div>

      {/* Content Sections */}
      <div className="flex flex-col gap-5">
        {privacyData.map((item) => (
          <PrivacySection 
            key={item.id}
            number={item.number}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div className="">
        <ContactSection />
      </div>

    </div>
  );
}