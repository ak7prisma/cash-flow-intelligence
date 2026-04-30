import { GoAlertFill } from "react-icons/go";
import BaseModal from "../ui/BaseModal";
import Button from "../ui/Button";

interface DeleteModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
  itemAmount: string;
}

export default function DeleteModals({
  isOpen,
  onClose,
  onDelete,
  itemName,
  itemAmount,
}: Readonly<DeleteModalsProps>) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 flex flex-col items-center text-center">
        {/* Warning Icon Section */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950 rounded-2xl dark:rounded-full flex items-center justify-center">
            <div className="relative">
              <GoAlertFill size={32} className="text-red-700 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[22px] font-bold text-slate-900 dark:text-white mb-4">
          Delete Movement?
        </h3>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-[1.6] mb-8 px-1">
          This action is irreversible. The record for <span className="font-bold text-slate-900 dark:text-slate-200">{itemName}</span> ({itemAmount}) will be permanently purged.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <Button
            text="Delete Permanently"
            variant="danger"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="h-16 bg-red-700 dark:bg-red-400 text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-red-500/20 dark:shadow-red-400/20"
          />
          <Button
            text="Keep Record"
            variant="secondary"
            onClick={onClose}
            className="h-16 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-50 border-none font-bold"
          />
        </div>
      </div>
      <div className="h-1.5 w-full bg-red-700 dark:bg-red-400"></div>
    </BaseModal>
  );
}