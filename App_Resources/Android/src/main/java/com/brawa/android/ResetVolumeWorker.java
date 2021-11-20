// package com.brawa.android;

// import android.content.Context;
// import android.media.AudioManager;

// import androidx.annotation.NonNull;
// import androidx.work.Data;
// import androidx.work.Worker;
// import androidx.work.WorkerParameters;

// public class ResetVolumeWorker extends Worker {
//     public ResetVolumeWorker(
//             @NonNull Context context,
//             @NonNull WorkerParameters params) {
//         super(context, params);
//     }

//     @NonNull
//     @Override
//     public Result doWork() {
//         Data inputData = getInputData();
//         int oldvolume = inputData.getInt("oldvolume", 1);
//         boolean hasDnDPermission = inputData.getBoolean("hasDnDPermission", false);
//         AudioManager am = null;
//         try {
//             if (hasDnDPermission) {
//                 am = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
//                 am.setStreamVolume(AudioManager.STREAM_RING, oldvolume, 0);
//             }
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//         return Result.success();
//     }
// }
