export interface preprocessConfig {
  fileUrl: string;
  zip: {
    savePath: string;
  };
  json: {
    savePath: string;
    processedPath: string;
  };
  github: {
    apiUrl: string;
    pathArg: string;
    checkFrequency: number;
  };
  dateToCompare: Date;
}
