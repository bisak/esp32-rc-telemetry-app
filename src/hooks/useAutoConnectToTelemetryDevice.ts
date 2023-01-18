import { useEffect, useState } from 'react';
import { BluetoothService } from '../service/BluetoothService';

export const useAutoConnectToTelemetryDevice = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log('connecting test')

        if (await BluetoothService.checkAndRequestBTPermissions()) {
          console.log('connecting')
          const connected = await BluetoothService.connectToTelemetryDevice();
          setIsConnected(connected);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return { isConnected };
};
