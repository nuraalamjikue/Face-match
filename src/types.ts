export interface FaceMatchResult {
  isMatch: boolean;
  distance: number;
  confidence: number; // percentage 0-100%
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: { x: number; y: number }[];
  label: string;
}

export interface MatchLog {
  id: string;
  timestamp: string;
  status: 'MATCHED' | 'NOT MATCHED';
  distance: number;
  confidence: number;
  snapshotUrl?: string;
}

export interface PythonConfig {
  referenceImagePath: string;
  threshold: number;
  cameraIndex: number;
  downscaleFactor: number; // 0.25, 0.5, 1.0
  processEveryNFrames: number;
  enableSound: boolean;
  enableLogging: boolean;
  logDir: string;
  multiFaceMode: 'main' | 'all';
  framework: 'face_recognition' | 'opencv_dnn' | 'deepface';
}

export type ActiveTab = 'simulator' | 'code' | 'configurator' | 'setup' | 'tester';
