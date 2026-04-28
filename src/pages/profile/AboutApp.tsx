import AboutAppHeader from "../../component/Profile/AboutApp/AboutHeader";
import AboutAppContent from "../../component/Profile/AboutApp/AboutContent";

export default function AboutApp() {
  return (
    <div className="w-full text-blue-950 dark:text-white font-sans flex flex-col gap-8 antialiased">
      <AboutAppHeader />
      <AboutAppContent />
    </div>
  );
}