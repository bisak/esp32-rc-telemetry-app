import React, { ComponentProps, useEffect, useRef } from 'react';
import WebView from 'react-native-webview';
import { HandleHTMLDimensionsFeature, makeWebshell, useAutoheight, WebHandle } from '@formidable-webview/webshell';
import { AddGraphFeature } from '../webshell/AddGraphFeature';
import { AddDataFeature } from '../webshell/AddDataFeature';

const addGraphFeature = new AddGraphFeature();
const addDataFeature = new AddDataFeature();
const Webshell = makeWebshell(WebView, addGraphFeature, addDataFeature, new HandleHTMLDimensionsFeature());

export type WebshellProps = ComponentProps<typeof Webshell>;

export const NewUplot: React.FC<{ data: any }> = ({ data }) => {
  const webHandleRef = useRef<WebHandle>(null);

  const { autoheightWebshellProps } = useAutoheight<WebshellProps>({
    webshellProps: { webHandleRef, source: { uri: 'file:///android_asset/index.html' } },
  });

  useEffect(() => {
    webHandleRef.current?.postMessageToWeb(addGraphFeature, 'addGraph', {
      data: [
        [
          225225, 225485, 225618, 225716, 225784, 225915, 226016, 226111, 226214, 226343, 226413, 226544, 226674,
          226772, 226871, 227107, 227206, 227333, 227467, 227532, 227697,
        ],
        [47, 46, 47, 47, 47, 47, 58, 98, 100, 100, 73, 0, 0, 0, 0, 100, 100, 100, 44, 0, 19],
        [47, 46, 47, 47, 47, 47, 58, 98, 100, 100, 73, 0, 0, 0, 0, 100, 100, 100, 44, 0, 19].map(x => x + 10),
      ],
      opts: {},
    });
  }, []);

  useEffect(() => {
    if (data) {
      webHandleRef.current?.postMessageToWeb(addDataFeature, 'addData', data);
    }
  }, [data]);

  return <Webshell {...autoheightWebshellProps} />;
};
