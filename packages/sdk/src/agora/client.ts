import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, IRtcEngineEventHandler } from 'react-native-agora';
import { Platform, PermissionsAndroid } from 'react-native';

export interface AgoraConfig {
  appId: string;
  channelName: string;
  token: string | null;
  uid?: number;
}

export type AgoraRole = 'broadcaster' | 'audience';

let engine: ReturnType<typeof createAgoraRtcEngine> | null = null;

const eventHandlers: IRtcEngineEventHandler = {};

let onRemoteUserJoinedHandler: ((uid: number) => void) | null = null;
let onRemoteUserLeftHandler: ((uid: number, reason: number) => void) | null = null;
let onConnectionStateChangedHandler: ((state: number, reason: number) => void) | null = null;
let onErrorHandler: ((code: number, msg: string) => void) | null = null;

function setupEventHandlers() {
  if (!engine) return;

  const e = engine as any;

  if (onRemoteUserJoinedHandler) {
    e.removeEventHandler('onRemoteUserJoined');
    e.registerEventHandler({ onRemoteUserJoined: onRemoteUserJoinedHandler });
  }
  if (onRemoteUserLeftHandler) {
    e.removeEventHandler('onRemoteUserLeft');
    e.registerEventHandler({
      onRemoteUserLeft: (uid: number, reason: number) => {
        onRemoteUserLeftHandler?.(uid, reason);
      },
    } as any);
  }
  if (onConnectionStateChangedHandler) {
    e.removeEventHandler('onConnectionStateChanged');
    e.registerEventHandler({
      onConnectionStateChanged: (state: number, reason: number) => {
        onConnectionStateChangedHandler?.(state, reason);
      },
    });
  }
  if (onErrorHandler) {
    e.removeEventHandler('onError');
    e.registerEventHandler({
      onError: (code: number, msg: string) => {
        onErrorHandler?.(code, msg);
      },
    });
  }
}

export async function initializeAgora(appId: string): Promise<void> {
  if (engine) return;

  try {
    if (Platform.OS === 'android') {
      const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, PermissionsAndroid.PERMISSIONS.CAMERA];
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED,
      );
      if (!allGranted) {
        throw new Error('Camera and microphone permissions are required');
      }
    }

    engine = createAgoraRtcEngine();
    engine.initialize({ appId });
    setupEventHandlers();
  } catch (error) {
    engine = null;
    throw error;
  }
}

export async function joinChannel(config: AgoraConfig, role: AgoraRole): Promise<void> {
  if (!engine) throw new Error('Engine not initialized. Call initializeAgora first.');

  try {
    const clientRole = role === 'broadcaster' ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience;

    engine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);
    engine.setClientRole(clientRole);

    const result = engine.joinChannel(config.token ?? '', config.channelName, config.uid ?? 0, {
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });

    if (result !== 0) throw new Error(`Failed to join channel: ${result}`);

    if (role === 'broadcaster') {
      engine.enableAudio();
      engine.enableVideo();
      engine.startPreview();
    }
  } catch (error) {
    throw error;
  }
}

export async function leaveChannel(): Promise<void> {
  if (!engine) return;

  try {
    engine.stopPreview();
    engine.leaveChannel();
  } catch (error) {
    console.error('Error leaving channel:', error);
  }
}

export async function switchCamera(): Promise<void> {
  if (!engine) throw new Error('Engine not initialized');

  try {
    engine.switchCamera();
  } catch (error) {
    console.error('Error switching camera:', error);
  }
}

export async function muteLocalAudio(muted: boolean): Promise<void> {
  if (!engine) return;

  try {
    if (muted) {
      engine.disableAudio();
    } else {
      engine.enableAudio();
    }
  } catch (error) {
    console.error('Error muting audio:', error);
  }
}

export async function muteLocalVideo(muted: boolean): Promise<void> {
  if (!engine) return;

  try {
    if (muted) {
      engine.disableVideo();
    } else {
      engine.enableVideo();
    }
  } catch (error) {
    console.error('Error muting video:', error);
  }
}

export async function destroyEngine(): Promise<void> {
  if (!engine) return;

  try {
    engine.leaveChannel();
    engine.stopPreview();
    engine.release();
    engine = null;

    onRemoteUserJoinedHandler = null;
    onRemoteUserLeftHandler = null;
    onConnectionStateChangedHandler = null;
    onErrorHandler = null;
  } catch (error) {
    console.error('Error destroying engine:', error);
    engine = null;
  }
}

export function getEngine() {
  return engine;
}

export function onRemoteUserJoined(callback: (uid: number) => void): void {
  onRemoteUserJoinedHandler = callback;
  setupEventHandlers();
}

export function onRemoteUserLeft(callback: (uid: number, reason: number) => void): void {
  onRemoteUserLeftHandler = callback;
  setupEventHandlers();
}

export function onConnectionStateChanged(callback: (state: number, reason: number) => void): void {
  onConnectionStateChangedHandler = callback;
  setupEventHandlers();
}

export function onError(callback: (code: number, msg: string) => void): void {
  onErrorHandler = callback;
  setupEventHandlers();
}

