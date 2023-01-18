import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Button, View, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NewUplot } from './src/chart/NewUplot';

import { useAutoConnectToTelemetryDevice } from './src/hooks/useAutoConnectToTelemetryDevice';
import { BluetoothService } from './src/service/BluetoothService';

const App = () => {
  const [data, setData] = useState<any>([[], [], []]);
  const { isConnected } = useAutoConnectToTelemetryDevice();

  useEffect(() => {
    if (isConnected) {
      BluetoothService.onDataRecieved(({ trPrc, ts, eTmp }: any) => {
        if (trPrc !== undefined) {
          setData((oldData: any) => {
            return [
              [...oldData[0].slice(-750), ts],
              [...oldData[1].slice(-750), trPrc],
              [...oldData[2].slice(-750), eTmp],
            ];
          });
        }
      });
    }
  }, [isConnected]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>{isConnected ? 'Connected' : 'Disconnected'}</Text>
      <NewUplot data={data} />
    </SafeAreaView>
  );
};

export default App;
