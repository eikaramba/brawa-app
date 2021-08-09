import { NativeScriptConfig } from '@nativescript/core';

export default {
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    id: "com.brawa.android"
  },
  // webpackConfigPath: './svelte-native.webpack.config.js',
} as NativeScriptConfig;