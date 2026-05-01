import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const setupDailyNotification = async (time: string = '19:00', enabled: boolean = true) => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notifikasi lokal hanya berjalan di perangkat Native.");
    return;
  }

  try {
    // 1. Selalu bersihkan jadwal lama agar tidak duplikat
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    if (!enabled) {
      console.log("Notifikasi dinonaktifkan.");
      return;
    }

    // 2. Cek & Request Permission
    let permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'prompt' || permStatus.display === 'denied') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      console.warn("Izin notifikasi tidak diberikan.");
      return;
    }

    // 3. Parse waktu (format HH:mm)
    const [hour, minute] = time.split(':').map(Number);

    // 4. Jadwalkan
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Waktunya Catat Keuangan! 💸",
          body: "Sudah catat pengeluaran dan pemasukanmu hari ini? Yuk catat sekarang di Cashflow AI.",
          schedule: {
            on: {
              hour: hour || 19,
              minute: minute || 0,
            },
            repeats: true,
            allowWhileIdle: true,
          },
          smallIcon: "ic_stat_icon_config_sample",
        },
      ],
    });

    console.log(`Daily notification scheduled for ${time}.`);
  } catch (error) {
    console.error("Gagal mengatur notifikasi:", error);
  }
};
