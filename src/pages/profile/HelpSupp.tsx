import SettingCard from '../../component/ui/SettingCard';
import FaqItem from '../../component/ui/FaqItem';
import ContactSection from '../../component/Profile/HelpSupp/ContactSection';
import SearchBar from '../../component/ui/SearchBar';
import { useFaqSearch } from '../../hooks/useFaqSearch';
import { faqs } from '../../data/faqs';

export default function HelpSupp() {
  const { search, setSearch, filteredData, openId, toggleOpen } = useFaqSearch(faqs);

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Search Bar */}
      <SearchBar 
        value={search} 
        onChange={setSearch} 
        placeholder="Search for FAQs..." 
      />

      {/* FAQ List */}
      <SettingCard title="FAQ">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredData.length > 0 ? (
            filteredData.map((faq) => (
              <FaqItem 
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggleOpen(faq.id)}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500 italic">
                No FAQs matching "{search}"
              </p>
            </div>
          )}
        </div>
      </SettingCard>

      {/* Contact Support */}
      <ContactSection />

    </div>
  );
}