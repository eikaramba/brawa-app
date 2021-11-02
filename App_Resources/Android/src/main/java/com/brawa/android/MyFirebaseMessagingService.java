package com.brawa.android;

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

import org.json.JSONException;
import org.json.JSONObject;


import java.time.Instant;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
	private int numMessages = 0;

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
		sendNotification(alarmId, template);

	}

	private void setReceivedTime(int alarmId) {
		OkHttpClient client = new OkHttpClient();
		JSONObject jsonObject = new JSONObject();
		// String currentDateTimeString = DateFormat.getDateInstance().format(new Date());
		Instant instant = Instant.now();

		try {
			jsonObject.put("received_at", instant.toString());
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

			NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			boolean hasDnDPermission = notificationManager.isNotificationPolicyAccessGranted();
			if(hasDnDPermission) {
				notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
			}

			assert notificationManager != null;
			notificationManager.notify(0, notificationBuilder.build());

			setReceivedTime(alarmId);


			
		} catch (JSONException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}