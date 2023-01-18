import { Alert, ToastAndroid } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, BluetoothDeviceReadEvent } from 'react-native-bluetooth-classic';
import { checkMultiple, Permission, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { throttle } from 'lodash';

const DEVICE_NAME = 'ESP32test';
const EVENT_THROTTLE_MS = 100;

const REQUIRED_BT_PERMISSIONS = [
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
];

export let serviceDevice: BluetoothDevice;

const isDeviceConnected = () => serviceDevice && serviceDevice.isConnected && serviceDevice.isConnected();

const connectToTelemetryDevice = async () => {
  if (await isDeviceConnected()) {
    return true;
  }

  const isBluetoothEnabled = await RNBluetoothClassic.requestBluetoothEnabled();
  if (!isBluetoothEnabled) {
    Alert.alert('Turn on bluetooth');
    return false;
  }

  const discoveryResult = await RNBluetoothClassic.startDiscovery();
  const discoveredDevice = discoveryResult.find(discoveredDevices => discoveredDevices.name === DEVICE_NAME);
  if (discoveredDevice) {
    serviceDevice = discoveredDevice;
    return await discoveredDevice.connect();
  } else {
    Alert.alert(`Unable to discover ${DEVICE_NAME} device`);
    return false;
  }
};

const onDataRecieved = (cb: any) => {
  serviceDevice.onDataReceived(
    throttle((event: BluetoothDeviceReadEvent) => {
      try {
        cb(JSON.parse(event.data));
      } catch (error) {
        console.log('Could not parse Bluetooth event json');
        console.log(error);
      }
    }, EVENT_THROTTLE_MS),
  );
};

const checkAndRequestBTPermissions = async () => {
  try {
    const checkResult = await checkMultiple(REQUIRED_BT_PERMISSIONS);
    const permissionsToRequest = Object.entries(checkResult)
      .map(([permission, status]) => {
        if (status === 'denied') {
          return permission;
        }
      })
      .filter(p => p) as Permission[];

    const results = await requestMultiple(permissionsToRequest);
    for (const [key, value] of Object.entries(results)) {
      if (value !== 'granted') {
        ToastAndroid.show(`${key}-${value}`, 500);
        return false;
      }
    }

    return true;
  } catch (e) {
    Alert.alert('Error getting permissions');
    console.log(e);
    return false;
  }
};

export const BluetoothService = {
  connectToTelemetryDevice,
  onDataRecieved,
  isDeviceConnected,
  checkAndRequestBTPermissions,
};
