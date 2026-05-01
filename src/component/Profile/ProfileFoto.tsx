import { useState, useRef } from 'react';
import { TbPencil, TbLoader2, TbUser } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { uploadToCloudinary } from '../../service/cloudinary';

export default function ProfileFoto() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const secureUrl = await uploadToCloudinary(file);
      
      await updateProfile(user, { photoURL: secureUrl });
      
      setPreviewUrl(secureUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const photoURL = previewUrl || user?.photoURL;

  return (
    <div className="flex flex-col items-center">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Container Foto */}
      <div className="relative">
        <div className="relative w-30 h-28 rounded-xl dark:rounded-full shadow-sm ring-slate-50 ring-3 dark:ring-cyan-400 overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-40' : 'opacity-100'}`}
            />
          ) : (
            <TbUser className={`text-slate-400 dark:text-slate-500 text-6xl transition-opacity duration-300 ${isUploading ? 'opacity-40' : 'opacity-100'}`} />
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-950/20 dark:bg-slate-900/40 backdrop-blur-sm">
              <TbLoader2 className="animate-spin text-white dark:text-cyan-400 text-3xl" />
            </div>
          )}
        </div>
        
        {/* Tombol Edit */}
        <button 
          onClick={handleEditClick}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 bg-teal-700 dark:bg-[#00F5FF] p-2 rounded-xl border-[3px] border-white dark:border-slate-950 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <TbPencil className="text-white dark:text-slate-900 text-sm" />
        </button>
      </div>

      {/* Nama & Email */}
      <div className="w-full max-w-70 flex flex-col items-center px-4">
        <h2 className="mt-4 text-4xl font-bold text-blue-950 dark:text-slate-100 tracking-tight capitalize truncate w-full text-center">
          {user?.displayName || 'User'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 truncate w-full text-center">
          {user?.email || 'email@example.com'}
        </p>
      </div>
    </div>
  );
}