import ProfileFooter from '../component/Profile/FooterProfile';
import ProfileFoto from '../component/Profile/ProfileFoto';
import SettingList from '../component/Profile/SettingList';
import { settingData, supportData } from '../data/profile';

export default function Profile() {

  return (
    <div className="w-full flex flex-col gap-6">
      <ProfileFoto />
      <SettingList sectionTitle="SETTING" items={settingData as any} />
      <SettingList sectionTitle="SUPPORT" items={supportData as any} />
      <ProfileFooter />
    </div>
  );
}