import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const setupDailyNotification = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notifikasi lokal hanya berjalan di perangkat Native.");
    return;
  }

  try {
    let permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'prompt' || permStatus.display === 'denied') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      console.warn("Izin notifikasi tidak diberikan.");
      return;
    }

    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Waktunya Catat Keuangan! 💸",
          body: "Sudah catat pengeluaran dan pemasukanmu hari ini? Yuk catat sekarang di Cashflow AI.",
          schedule: {
            on: {
              hour: 19,
              minute: 0,
            },
            repeats: true,
          },
          smallIcon: "ic_stat_icon_config_sample",
        },
      ],
    });

    console.log("Daily notification scheduled for 19:00.");
  } catch (error) {
    console.error("Gagal mengatur notifikasi:", error);
  }
};
