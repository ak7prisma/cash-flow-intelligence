import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import BackgroundElement from './BackgroundElement';

interface ShutterSplashScreenProps {
  onComplete: () => void;
  ready: boolean;
}

const ShutterSplashScreen: React.FC<ShutterSplashScreenProps> = ({ onComplete, ready }) => {
  const [status, setStatus] = useState<'idle' | 'closing' | 'opening' | 'done'>('idle');
  const [isAnimationClosingDone, setIsAnimationClosingDone] = useState(false);
  const [safetyTrigger, setSafetyTrigger] = useState(false);

  useEffect(() => {
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch (e) {
        console.warn('Capacitor SplashScreen not available', e);
      }
    };
    hideNativeSplash();

    const startClosing = async () => {
      await new Promise(r => setTimeout(r, 1000));
      setStatus('closing');

      await new Promise(r => setTimeout(r, 800));
      setIsAnimationClosingDone(true);
    };

    // Safety Fallback
    const timer = setTimeout(() => {
      setSafetyTrigger(true);
    }, 4000);

    startClosing();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAnimationClosingDone && (ready || safetyTrigger) && status === 'closing') {
      const startOpening = async () => {

        await new Promise(r => setTimeout(r, 400));
        setStatus('opening');

        await new Promise(r => setTimeout(r, 800));
        setStatus('done');
        onComplete();
      };
      startOpening();
    }
  }, [isAnimationClosingDone, ready, safetyTrigger, status, onComplete]);

  if (status === 'done') return null;

  const isClosed = status === 'closing' || (status === 'opening' && !(ready || safetyTrigger));
  const topOverlayTransform = isClosed ? '-translate-y-75' : '-translate-y-full';
  const bottomOverlayTransform = isClosed ? 'translate-y-75' : 'translate-y-full';
  
  const logoOpacity = status === 'idle' ? 'opacity-100' : 'opacity-0';
  const easing = status === 'opening' ? 'ease-out' : 'ease-in-out';

  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden">

        <div 
          className={`absolute inset-0 bg-slate-50 dark:bg-slate-900 transition-opacity duration-700 ease-in-out ${
            status === 'opening' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <BackgroundElement />
        </div>

        <div className={`relative z-0 transition-opacity duration-500 ease-out ${logoOpacity}`}>
          <img 
            src="/LogoCFI.png" 
            alt="Logo" 
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Top Overlay */}
        <div 
          className={`absolute top-0 w-full h-full z-10 transition-transform duration-800 ${easing} ${topOverlayTransform}`}
        >
          <img 
            src="/asset/TopOverlay.png" 
            alt="Top Overlay" 
            className="w-full h-full overflow-y-visible"
          />
        </div>

        {/* Bottom Overlay */}
        <div 
          className={`absolute bottom-0 w-full h-full z-10 transition-transform duration-800 ${easing} ${bottomOverlayTransform}`}
        >
          <img 
            src="/asset/BottomOverlay.png" 
            alt="Bottom Overlay" 
            className="w-full h-full overflow-y-visible"
          />
        </div>
      </div>
    </>
  );
};

export default ShutterSplashScreen;
