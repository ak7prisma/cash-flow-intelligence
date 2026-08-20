import { useState, useMemo } from "react";
import BaseModal from "../ui/BaseModal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateInput from "../ui/DateInput";
import { CATEGORIES } from "../../data/categories";
import { getLocalDateISO, parseLocalDate } from "../../utils/dateHelpers";

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
  rawItem?: any;
}

export default function EditModals({
  isOpen,
  onClose,
  onSave,
  item,
  rawItem,
}: Readonly<EditModalsProps>) {
  const [selectedCategory, setSelectedCategory] = useState(item?.title || CATEGORIES[0]);
  const [amount, setAmount] = useState(rawItem?.amount?.toString() || "");

  const formattedDate = useMemo(() => {
    if (rawItem?.date) {
      return getLocalDateISO(new Date(rawItem.date));
    }
    return getLocalDateISO();
  }, [rawItem?.date]);

  const [date, setDate] = useState(formattedDate);

  if (!item) return null;

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
            placeholder="0" 
            className="text-slate-500 dark:text-slate-400"
            inputClassName="text-2xl font-bold text-blue-950 dark:text-white !bg-slate-100 dark:!bg-slate-800/70 !h-16 border-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Select 
            label="CATEGORY"
            options={CATEGORIES}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />

          <DateInput 
            label="TRANSACTION DATE"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            text="Save Changes"
            variant="primary"
            onClick={() => {
              // Parse the picked date as local time and keep the original
              // time-of-day, so editing the date doesn't reset it to 00:00.
              const [year, month, day] = date.split("-").map(Number);
              const original = rawItem?.date ? new Date(rawItem.date) : null;
              const newDate = original
                ? new Date(year, month - 1, day, original.getHours(), original.getMinutes(), original.getSeconds())
                : parseLocalDate(date);

              onSave({
                amount: Number(amount) || 0,
                category: selectedCategory,
                date: newDate
              });
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