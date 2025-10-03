export interface CanvasPoint {
  x: number;
  y: number;
  cssToCanvasX: number;
  cssToCanvasY: number;
}

export interface LastCanvasPoint {
  x: number;
  y: number;
}

export interface PressureSettings {
  enablePressure: boolean;
  minPressure: number;
  maxPressure: number;
  pressureSensitivity: number;
  taperStart: boolean;
  taperEnd: boolean;
  velocityInfluence: number;
}

export interface StrokePoint extends CanvasPoint {
  pressure: number;
  timestamp: number;
  velocity: number;
}