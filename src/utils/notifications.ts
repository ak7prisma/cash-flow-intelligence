import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const setupDailyNotification = async (time: string = '19:00', enabled: boolean = true) => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notifikasi lokal hanya berjalan di perangkat Native.");
    return;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    if (!enabled) {
      console.log("Notifikasi dinonaktifkan.");
      return;
    }

    let permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'prompt' || permStatus.display === 'denied') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      console.warn("Izin notifikasi tidak diberikan.");
      return;
    }

    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id: 'daily-reminders',
        name: 'Daily Reminders',
        importance: 5,
        description: 'Daily transaction reminders',
        sound: 'beep.wav',
        visibility: 1,
      });
    }

    const [hour, minute] = time.split(':').map(Number);
    const validHour = isNaN(hour) ? 19 : hour;
    const validMinute = isNaN(minute) ? 0 : minute;

    const now = new Date();
    const scheduleDate = new Date();
    scheduleDate.setHours(validHour, validMinute, 0, 0);

    if (scheduleDate <= now) {
      scheduleDate.setDate(scheduleDate.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Waktunya Catat Keuangan! 💸",
          body: "Sudah catat pengeluaran dan pemasukanmu hari ini? Yuk catat sekarang di Cashflow AI.",
          channelId: 'daily-reminders',
          schedule: {
            at: scheduleDate,
            repeats: true,
            every: 'day',
            allowWhileIdle: true,
          },
        },
      ],
    });

    console.log(`Daily notification scheduled for ${scheduleDate.toString()}.`);
  } catch (error) {
    console.error("Gagal mengatur notifikasi:", error);
  }
};
