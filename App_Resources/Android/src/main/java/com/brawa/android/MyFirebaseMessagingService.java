package com.brawa.android;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import android.media.AudioManager;
import android.media.AudioDeviceInfo;
import android.util.Log;
import com.tns.NativeScriptActivity;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.io.IOException;
import java.net.URL;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;
import java.io.IOException;

import android.os.PowerManager;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Calendar;
import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

// import androidx.work.Data;
// import androidx.work.OneTimeWorkRequest;
// import androidx.work.WorkManager;


// import java.time.Instant;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

	@Override
	public void onNewToken(String token) {
		Log.d("FCM", "Refreshed token: " + token);

		// If you want to send messages to this application instance or
		// manage this apps subscriptions on the server side, send the
		// FCM registration token to your app server.
		// sendRegistrationToServer(token);
	}

	@Override
	public void onMessageReceived(RemoteMessage remoteMessage) {
		super.onMessageReceived(remoteMessage);
		Map<String, String> data = remoteMessage.getData();

		int alarmId=Integer.parseInt(data.get("id").toString());
		String template=data.get("template").toString();


		PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
		PowerManager.WakeLock  wakeLock = powerManager.newWakeLock(PowerManager.FULL_WAKE_LOCK |
				PowerManager.ACQUIRE_CAUSES_WAKEUP |
				PowerManager.ON_AFTER_RELEASE, "brawa::WakeLock");
		PowerManager.WakeLock screenLock = null;
		wakeLock.acquire();


		sendNotification(alarmId, template);

	}

	private void setReceivedTime(int alarmId) {
		OkHttpClient client = new OkHttpClient();
		JSONObject jsonObject = new JSONObject();
		Date currentTime = Calendar.getInstance().getTime();
		//substract 1 hour from currentTime
		Calendar cal = Calendar.getInstance();
		cal.setTime(currentTime);
		cal.add(Calendar.HOUR_OF_DAY, -2);
		Date oneHourAgo = cal.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		String strDate = sdf.format(oneHourAgo).replace(" ", "T") + "Z";
		// Instant instant = Instant.now();

		try {
			// Log.d("received_at instant", instant.toString());
			Log.d("received_at strDate", strDate);
			jsonObject.put("received_at", strDate);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		MediaType JSON = MediaType.parse("application/json; charset=utf-8");
		RequestBody body = RequestBody.create(JSON, jsonObject.toString());
	
	
		Request request = new Request.Builder()
		// .url("http://192.168.178.58:1337/alarms/" + alarmId)   //URL
		.url("https://app.eikaramba.de/brawa/api/alarms/" + alarmId)   //URL
		.put(body)
		.build();
		
		Response response = null;
		try {
			response = client.newCall(request).execute();
			String resStr = response.body().string();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private boolean isHeadsetOn(AudioManager am) {

    if (am == null)
        return false;

	try {
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
			return am.isWiredHeadsetOn() || am.isBluetoothScoOn() || am.isBluetoothA2dpOn();
		} else {
			AudioDeviceInfo[] devices = am.getDevices(AudioManager.GET_DEVICES_OUTPUTS);

			for (AudioDeviceInfo device : devices) {
				if (device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADSET
						|| device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADPHONES
						|| device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP
						|| device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_SCO) {
					return true;
				}
			}
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
    return false;
}

	private void sendNotification(int alarmId, String template) {
		try {
			JSONObject json = new JSONObject(template);
			Intent intent = new Intent(this, NativeScriptActivity.class);
			intent.putExtra("templateJson", template);
			intent.putExtra("alarmId", alarmId);

			PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

			String title=json.getString("notification_titel");
			String channelName = "AlarmA";
			if(json.getString("alarmSound")!="null") {
				try {
					channelName = json.getString("alarmSound");
				}catch (JSONException e){}
			}

			NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelName)
				.setContentTitle(json.getString("notification_titel"))
				.setContentText(json.getString("notification_body"))
				.setAutoCancel(true)
				.setContentIntent(pendingIntent)
				.setCategory(NotificationCompat.CATEGORY_ALARM)
				.setPriority(Notification.PRIORITY_MAX)
				.setLights(Color.RED, 1000, 300)
				.setSmallIcon(R.drawable.notification_icon);

			int oldvolume=1;
			boolean changedVolume=false;
			AudioManager am = null;
			boolean hasDnDPermission=false;
			NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			try {
				hasDnDPermission = notificationManager.isNotificationPolicyAccessGranted();
				if(hasDnDPermission) {
					notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
					am = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
					oldvolume  = am.getStreamVolume(AudioManager.STREAM_RING);
					am.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
					if(!isHeadsetOn(am)){
						am.setStreamVolume(AudioManager.STREAM_RING,am.getStreamMaxVolume(AudioManager.STREAM_RING),0);
						changedVolume=true;
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			notificationManager.notify(0, notificationBuilder.build());

			setReceivedTime(alarmId);

			AudioManager finalam = am;
			int finalOldvolume = oldvolume;
			boolean finalhasDnDPermission = hasDnDPermission;



			if(changedVolume){
					// WorkManager.getInstance(this).enqueue(
			 		// new OneTimeWorkRequest.Builder(ResetVolumeWorker.class)
			 		// 		.setInitialDelay(30, TimeUnit.SECONDS)
			 		// 		.setInputData(new Data.Builder()
			 		// 				.putInt("oldvolume", finalOldvolume)
			 		// 				.putBoolean("hasDnDPermission", finalhasDnDPermission)
			 		// 				.build())
			 		// 		.build());
				new Thread(() -> {
					try {
						Thread.sleep(30000);
					} catch (Exception e) {
						e.printStackTrace();
					}
					if(finalhasDnDPermission && finalam!=null) {
						finalam.setStreamVolume(AudioManager.STREAM_RING,finalOldvolume,0);
					}
				}).start();
			}

			
		} catch (JSONException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

// class ResetVolumeWorker extends Worker {
// 	@NonNull
// 	@Override
// 	public WorkerResult doWork() {
// 		Data inputData = getInputData();
// 		int oldvolume = inputData.getInt("oldvolume",1);
// 		boolean changedVolume = inputData.getBoolean("changedVolume",false);
// 		boolean hasDnDPermission = inputData.getBoolean("hasDnDPermission",false);
// 		AudioManager am = null;
// 		try {
// 			if(hasDnDPermission) {
// 				am = (AudioManager)getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
// 				am.setStreamVolume(AudioManager.STREAM_RING,oldvolume,0);
// 			}
// 		} catch (Exception e) {
// 			e.printStackTrace();
// 		}
// 		return WorkerResult.SUCCESS;
// 	}
// }