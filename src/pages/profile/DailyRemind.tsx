import { useState } from 'react';
import Toggle from '../../component/ui/Toggle';
import TimePicker from '../../component/ui/TimePicker';
import FrequencyRadio from '../../component/ui/FrequencyRadio';

export default function DailyRemind() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [time, setTime] = useState('09:00');
  const [frequency, setFrequency] = useState('daily');

  return (
    <div className="w-full mx-2">
      <div className="space-y-5">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="text-4xl font-bold text-blue-950 dark:text-white mb-2">
              Notification
            </h4>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Stay consistent with your goals by setting intelligent nudges.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-5">

          <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all">
            <Toggle 
              label={`${notifEnabled ? "Disable" : "Enable"} Notifications`} 
              enabled={notifEnabled} 
              onChange={setNotifEnabled} 
            />
          </div>

          {/* Settings */}
          <div 
            className={`flex flex-col gap-3 transition-all duration-500 ease-in-out ${
              notifEnabled 
                ? "opacity-100" 
                : "opacity-40 pointer-events-none select-none grayscale-25"
            }`}
          >
            {/* Time Picker */}
            <TimePicker 
              label="Reminder Time" 
              value={time} 
              onChange={setTime} 
              hint="Pick a time when you usually review your expenses."
            />

            {/* Radio Frequency */}
            <FrequencyRadio 
              label="Frequency" 
              value={frequency} 
              onChange={setFrequency} 
            />

            {!notifEnabled && <div className="absolute inset-0 z-50 cursor-not-allowed" />}
          </div>
        </div>

      </div>
    </div>
  );
}