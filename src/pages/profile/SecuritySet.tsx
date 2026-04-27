import FormHeader from '../../component/ui/FormHeader';
import { FormContainer } from '../../component/auth/FormContainer';
import Input from '../../component/ui/Input';
import Button from '../../component/ui/Button';

export default function SecuritySettingContent () {
  return (
    <FormContainer>
      
      <FormHeader 
        title="CHANGE PASSWORD" 
        subtitle="Enter your current password and your new password below." 
      />

      {/* Form Inputs */}
      <div>
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
      <div className="space-y-6">
        <Button 
          text="Update Password" 
          variant="primary" 
        />
        
        <Button 
          text="Cancel and Return" 
          variant="ghost" 
        />
      </div>

    </FormContainer>
  );
};