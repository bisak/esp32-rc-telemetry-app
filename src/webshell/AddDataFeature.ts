import { FeatureBuilder } from '@formidable-webview/webshell';
import script from './AddDataFeature.webjs';





export const AddDataFeature = new FeatureBuilder({
  script,
  defaultOptions: {},
  identifier: 'rctelemetry/addData',
})
  .withWebHandler<string, any[]>('addData')
  .build();
