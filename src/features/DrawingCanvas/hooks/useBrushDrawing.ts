import { useRef } from "react";
import type { Brush } from "../../../types/BrushTypes";
import type { CanvasPoint, LastCanvasPoint, PressureSettings, StrokePoint } from "../../../types/CanvasTypes";
import { hexToRgba } from "../../../utils/colorsUtils";

export function useBrushDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  brush: Brush,
  scale: number,
  eraseMode: boolean,
  pressureSettings: PressureSettings = {
    enablePressure: true,
    minPressure: 0.3,
    maxPressure: 1.0,
    pressureSensitivity: 0.7,
    taperStart: false,
    taperEnd: true,
    velocityInfluence: 0.4
  },
  forceStrongPressure: boolean = false,
  disablePressure: boolean = false
) {
  const lastPosRef = useRef<CanvasPoint | null>(null);
  const strokePointsRef = useRef<StrokePoint[]>([]);
  const totalStrokeDistanceRef = useRef(0);
  const strokeStartTimeRef = useRef<number | null>(null);

  const simulatePressure = (point: CanvasPoint, lastPoint: StrokePoint | null): number => {
    if (disablePressure || !pressureSettings.enablePressure) return 1.0;

    if (forceStrongPressure) {
      return pressureSettings.maxPressure;
    }

    let pressure = pressureSettings.minPressure;
    
    if (strokePointsRef.current.length <= 2) {
      pressure = pressureSettings.minPressure;
    } else {
      if (lastPoint && pressureSettings.velocityInfluence > 0) {
        const timeDiff = Date.now() - lastPoint.timestamp;
        const dist = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + 
          Math.pow(point.y - lastPoint.y, 2)
        );
        const velocity = timeDiff > 0 ? dist / timeDiff : 0;
        
        const maxVelocity = 10;
        const velocityFactor = Math.max(0, 1 - (velocity / maxVelocity));
        pressure += (pressureSettings.maxPressure - pressureSettings.minPressure) * 
                   velocityFactor * pressureSettings.velocityInfluence;
      }
      
      if (strokePointsRef.current.length > 2) {
        const currentDistance = calculateDistanceFromStart(strokePointsRef.current, point);
        const totalDistance = totalStrokeDistanceRef.current;
        const taperDistance = Math.min(30, totalDistance * 0.2);
        
        if (pressureSettings.taperEnd && totalDistance - currentDistance < taperDistance) {
          const endTaper = (totalDistance - currentDistance) / taperDistance;
          pressure *= easeInOutCubic(endTaper);
        }
      }
    }
    
    if (strokePointsRef.current.length > 3) {
      const timeVariation = 0.05 * Math.sin(Date.now() * 0.005);
      pressure = Math.max(pressureSettings.minPressure, 
                 Math.min(pressureSettings.maxPressure, pressure + timeVariation));
    }
    
    pressure = pressureSettings.minPressure + 
              (pressure - pressureSettings.minPressure) * pressureSettings.pressureSensitivity;
    
    return Math.max(pressureSettings.minPressure, Math.min(pressureSettings.maxPressure, pressure));
  };

  const drawStroke = (
    p: CanvasPoint,
    last: LastCanvasPoint
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dx = p.x - last.x;
    const dy = p.y - last.y;
    const segmentDist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const spacingCanvas = (brush.spacing || 2) * p.cssToCanvasX;
    const baseSize = brush.size * scale * p.cssToCanvasX;
    const baseOpacity = brush.opacity ?? 1;

    let pressure: number;
    if (strokePointsRef.current.length === 0) {
      pressure = pressureSettings.minPressure;
    } else {
      const lastStrokePoint = strokePointsRef.current[strokePointsRef.current.length - 1];
      pressure = simulatePressure(p, lastStrokePoint);
    }

    const strokePoint: StrokePoint = {
      ...p,
      pressure,
      timestamp: Date.now(),
      velocity: strokePointsRef.current.length > 0 ? calculateVelocity(p, strokePointsRef.current[strokePointsRef.current.length - 1]) : 0
    };
    
    if (strokePointsRef.current.length === 0) {
      strokePointsRef.current.push({ 
        ...last, 
        pressure: pressureSettings.minPressure, 
        timestamp: Date.now(), 
        velocity: 0 
      });
      strokeStartTimeRef.current = Date.now();
    }
    strokePointsRef.current.push(strokePoint);
    
    // Atualiza distância total
    totalStrokeDistanceRef.current = calculateTotalStrokeDistance(strokePointsRef.current);

    // Desenha o segmento atual com pressão
    for (let i = 0; i < segmentDist; i += spacingCanvas) {
      const ix = last.x + dx * (i / segmentDist);
      const iy = last.y + dy * (i / segmentDist);
      
      // Interpola a pressão entre os pontos
      const startPoint = strokePointsRef.current[strokePointsRef.current.length - 2] || 
                { ...last, pressure: pressureSettings.minPressure, timestamp: Date.now(), velocity: 0 };
      const endPoint = strokePoint;
      
      const interpolatedPressure = interpolatePressure(
        { x: ix, y: iy },
        startPoint,
        endPoint
      );
      
      const pressureFactor = interpolatedPressure;
      const brushSizeCanvas = baseSize * pressureFactor;
      const opacity = baseOpacity * pressureFactor;

      if (eraseMode) {
        ctx.clearRect(
          ix - brushSizeCanvas / 2,
          iy - brushSizeCanvas / 2,
          brushSizeCanvas,
          brushSizeCanvas
        );
      } else if (brush.shape instanceof HTMLImageElement) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(
          brush.shape,
          ix - brushSizeCanvas / 2,
          iy - brushSizeCanvas / 2,
          brushSizeCanvas,
          brushSizeCanvas
        );
      } else {
        ctx.fillStyle = hexToRgba(brush.color, opacity);
        ctx.beginPath();
        ctx.arc(ix, iy, brushSizeCanvas / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }
  };

  const calculateVelocity = (current: CanvasPoint, last: StrokePoint): number => {
    const timeDiff = Date.now() - last.timestamp;
    if (timeDiff === 0) return 0;
    
    const dist = Math.sqrt(
      Math.pow(current.x - last.x, 2) + 
      Math.pow(current.y - last.y, 2)
    );
    return dist / timeDiff;
  };

  const interpolatePressure = (point: CanvasPoint, start: StrokePoint, end: StrokePoint): number => {
    const totalDist = Math.sqrt(
      Math.pow(end.x - start.x, 2) + 
      Math.pow(end.y - start.y, 2)
    );
    
    if (totalDist === 0) return start.pressure;
    
    const pointDist = Math.sqrt(
      Math.pow(point.x - start.x, 2) + 
      Math.pow(point.y - start.y, 2)
    );
    
    const t = pointDist / totalDist;
    return start.pressure + (end.pressure - start.pressure) * t;
  };

  const calculateTotalStrokeDistance = (points: StrokePoint[]): number => {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  const calculateDistanceFromStart = (points: StrokePoint[], targetPoint: CanvasPoint): number => {
    let distance = 0;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      if (isPointBetween(targetPoint, prevPoint, currentPoint)) {
        const dxToTarget = targetPoint.x - prevPoint.x;
        const dyToTarget = targetPoint.y - prevPoint.y;
        distance += Math.sqrt(dxToTarget * dxToTarget + dyToTarget * dyToTarget);
        break;
      } else {
        const dx = currentPoint.x - prevPoint.x;
        const dy = currentPoint.y - prevPoint.y;
        distance += Math.sqrt(dx * dx + dy * dy);
      }
    }
    
    return distance;
  };

  const isPointBetween = (point: CanvasPoint, start: CanvasPoint, end: CanvasPoint): boolean => {
    const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y);
    if (Math.abs(crossProduct) > 0.1) return false;
    
    const dotProduct = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y);
    if (dotProduct < 0) return false;
    
    const squaredLength = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
    if (dotProduct > squaredLength) return false;
    
    return true;
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const resetStroke = () => {
    strokePointsRef.current = [];
    totalStrokeDistanceRef.current = 0;
    strokeStartTimeRef.current = null;
  };

  // Função para debug - mostra dados de pressão
  const getStrokeDebugInfo = () => {
    if (strokePointsRef.current.length === 0) return null;
    
    const currentPoint = strokePointsRef.current[strokePointsRef.current.length - 1];
    return {
      points: strokePointsRef.current.length,
      totalDistance: totalStrokeDistanceRef.current,
      currentPressure: currentPoint.pressure,
      currentVelocity: currentPoint.velocity,
      strokeDuration: strokeStartTimeRef.current ? Date.now() - strokeStartTimeRef.current : 0
    };
  };

  return { 
    lastPosRef, 
    drawStroke, 
    resetStroke,
    getStrokeDebugInfo
  };
}