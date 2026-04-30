import { useState, useMemo } from "react";
import BaseModal from "../ui/BaseModal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateInput from "../ui/DateInput";

interface EditModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item: {
    title: string;
    subtitle: string;
    amount: string;
    time: string;
    icon: any;
  };
}

const CATEGORIES = [
  "Electronics & Hardware",
  "Food & Beverage",
  "Transportation",
  "Entertainment",
  "Healthcare",
];

export default function EditModals({
  isOpen,
  onClose,
  onSave,
  item,
}: Readonly<EditModalsProps>) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const formattedDate = useMemo(() => {
    const today = new Date();
    if (item.time.toLowerCase().includes("today")) {
      return today.toISOString().split("T")[0];
    }
    if (item.time.toLowerCase().includes("yesterday")) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.toISOString().split("T")[0];
    }

    return today.toISOString().split("T")[0];
  }, [item.time]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 dark:text-cyan-400">
              <span className="hidden dark:inline">Edit Transaction</span>
              <span className="dark:hidden">Edit Movement</span>
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
              {item.title}
            </p>
          </div>
          <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl dark:rounded-full flex items-center justify-center text-teal-800 dark:text-cyan-400">
            <item.icon size={24} />
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6">
          <Input 
            label="AMOUNT" 
            placeholder="Rp 0" 
            className="text-slate-500 dark:text-slate-400"
            inputClassName="text-2xl font-bold text-blue-950 dark:text-white !bg-slate-100 dark:!bg-slate-800/70 !h-16 border-none"
            defaultValue={item.amount}
          />

          <Select 
            label="CATEGORY"
            options={CATEGORIES}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />

          <DateInput 
            label="TRANSACTION DATE"
            defaultValue={formattedDate}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            text="Save Changes"
            variant="primary"
            onClick={() => {
              onSave({});
              onClose();
            }}
            className="h-16 bg-teal-800 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold rounded-2xl shadow-lg shadow-teal-500/20 dark:shadow-cyan-400/20"
          />
          <Button
            text="Cancel"
            variant="secondary"
            onClick={onClose}
            className="h-14 bg-transparent border-none text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-bold"
          />
        </div>
      </div>
    </BaseModal>
  );
}