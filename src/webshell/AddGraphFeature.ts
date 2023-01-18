import { FeatureBuilder } from '@formidable-webview/webshell';
import script from './AddGraphFeature.webjs';







export const AddGraphFeature = new FeatureBuilder({
  script,
  defaultOptions: {},
  identifier: 'rcTelemetry/addGraph',
})
  .withWebHandler<string, { opts: any; data: any }>('addGraph')
  .build();
