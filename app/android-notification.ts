import { isAndroid, Utils } from "@nativescript/core";

export function getResource(
  name: string,
  folder?: string
): { id: number; uri: android.net.Uri } {
  const context = Utils.android.getApplicationContext();
  const packageName = context.getPackageName();
  const id = context
    .getResources()
    .getIdentifier(name, folder || "raw", packageName);
  const uri = android.net.Uri.parse(
    `${android.content.ContentResolver.SCHEME_ANDROID_RESOURCE}://${packageName}/${id}`
  );
  return { id, uri };
}

export function createAndroidNotificationChannel(channel: {
  id: string;
  name: string;
  description: string;
  soundFilename?: string;
}) {
  const ANDROID_OREO_SDK_VERSION = 26;
  if (
    isAndroid &&
    android.os.Build.VERSION.SDK_INT >= ANDROID_OREO_SDK_VERSION
  ) {
    // @ts-ignore
    const notificationChannel = new android.app.NotificationChannel(
      channel.id,
      channel.name,
      // @ts-ignore
      android.app.NotificationManager.IMPORTANCE_HIGH
    );
    notificationChannel.setDescription(channel.description);
    notificationChannel.enableLights(true);
    notificationChannel.setLightColor(android.graphics.Color.RED);
    if(channel.id!="reminder"){
      notificationChannel.setBypassDnd(true);
      notificationChannel.setLockscreenVisibility(1);
    }
    notificationChannel.enableVibration(true);
    if (channel.soundFilename) {
      // @ts-ignore
      const audioAttributes = new android.media.AudioAttributes.Builder()
      // @ts-ignore
        .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
        // @ts-ignore
        .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
        .build();
      notificationChannel.setSound(
        getResource(channel.soundFilename).uri,
        audioAttributes
      );
    }
    const context = Utils.android.getApplicationContext();
    const notificationManager = context.getSystemService(
      android.app.NotificationManager.class
    );
    notificationManager.createNotificationChannel(notificationChannel);
  }
}