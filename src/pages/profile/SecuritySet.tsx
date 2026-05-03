import { useState } from 'react';
import { useAuthActions } from '../../hooks/useAuthActions';
import SettingCard from '../../component/ui/SettingCard';
import Input from '../../component/ui/Input';
import Button from '../../component/ui/Button';
import { FormContainer } from '../../component/auth/FormContainer';
import AlertBanner from '../../component/ui/AlertBanner';

export default function SecuritySettingContent() {
  const { changePassword, loading, error, setError } = useAuthActions();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdatePassword = async () => {
    setError(null);
    setSuccess('');

    if (!oldPassword.trim()) {
      setError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please check and try again.');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    const ok = await changePassword(oldPassword, newPassword);
    if (ok) {
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="w-full">
      <SettingCard title="SECURITY SETTINGS">
        <FormContainer onSubmit={handleUpdatePassword}>
          <div>
            <h4 className="text-lg font-bold text-blue-950 dark:text-white mb-1">
              Change Password
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your current password and your new password below.
            </p>
          </div>

          <AlertBanner message={error} />
          <AlertBanner message={success} variant="success" />

          {/* Form Inputs */}
          <div className="space-y-4">
            <Input
              label="Old Password"
              type="password"
              placeholder="••••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••••"
              hint="Use 8+ characters with a mix of letters, numbers &amp; symbols."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Form Actions */}
          <div className="space-y-4 mt-2">
            <Button
              text={loading ? "Updating..." : "Update Password"}
              variant="primary"
              type="submit"
              disabled={loading}
            />

            <Button
              text="Cancel and Return"
              variant="ghost"
              to='/profile'
              disabled={loading}
            />
          </div>
        </FormContainer>
      </SettingCard>
    </div>
  );
}