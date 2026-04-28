import SettingCard from '../../component/ui/SettingCard';
import Input from '../../component/ui/Input';
import Button from '../../component/ui/Button';
import { FormContainer } from '../../component/auth/FormContainer';

export default function SecuritySettingContent () {
  return (
    <div className="w-full">
      <SettingCard title="SECURITY SETTINGS">
        <FormContainer >
          <div>
            <h4 className="text-lg font-bold text-blue-950 dark:text-white mb-1">
              Change Password
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your current password and your new password below.
            </p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            <Input 
              label="Old Password" 
              type="password" 
              placeholder="••••••••••" 
            />

            <Input 
              label="New Password" 
              type="password" 
              placeholder="••••••••••" 
              hint="Use 8+ characters with a mix of letters, numbers & symbols."
            />

            <Input 
              label="Confirm Password" 
              type="password" 
              placeholder="••••••••••" 
            />
          </div>

          {/* Form Actions */}
          <div className="space-y-4 mt-2">
            <Button 
              text="Update Password" 
              variant="primary" 
            />
            
            <Button 
              text="Cancel and Return" 
              variant="ghost" 
              to='/profile'
            />
          </div>
        </FormContainer>
      </SettingCard>
    </div>
  );
};