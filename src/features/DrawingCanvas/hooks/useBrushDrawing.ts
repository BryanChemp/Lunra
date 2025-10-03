import { useRef } from "react";
import type { Brush } from "../../../types/BrushTypes";
import type { CanvasPoint, LastCanvasPoint } from "../../../types/CanvasTypes";
import { hexToRgba } from "../../../utils/colorsUtils";

export function useBrushDrawing(
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	brush: Brush,
	scale: number,
	eraseMode: boolean
) {
	const lastPosRef = useRef<{ x: number; y: number } | null>(null);

	const drawStroke = (p: CanvasPoint, last: LastCanvasPoint) => {
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		const dx = p.x - last.x;
		const dy = p.y - last.y;
		const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

		const spacingCanvas = (brush.spacing || 1) * p.cssToCanvasX;
		const brushSizeCanvas = brush.size * scale * p.cssToCanvasX;

		const fillColor = hexToRgba(brush.color, brush.opacity ?? 1);

		for (let i = 0; i < dist; i += spacingCanvas) {
			const t = i / dist;
			const ix = last.x + dx * t;
			const iy = last.y + dy * t;

			if (eraseMode) {
				ctx.clearRect(
					ix - brushSizeCanvas / 2,
					iy - brushSizeCanvas / 2,
					brushSizeCanvas,
					brushSizeCanvas
				);
			} else if (brush.shape instanceof HTMLImageElement) {
				ctx.globalAlpha = brush.opacity ?? 1;
				ctx.drawImage(
					brush.shape,
					ix - brushSizeCanvas / 2,
					iy - brushSizeCanvas / 2,
					brushSizeCanvas,
					brushSizeCanvas
				);
				ctx.globalAlpha = 1;
			} else if (brush.shape === "square") {
				ctx.fillStyle = fillColor;
				ctx.fillRect(
					ix - brushSizeCanvas / 2,
					iy - brushSizeCanvas / 2,
					brushSizeCanvas,
					brushSizeCanvas
				);
			} else {
				ctx.fillStyle = fillColor;
				ctx.beginPath();
				ctx.arc(ix, iy, brushSizeCanvas / 2, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	};

	return { lastPosRef, drawStroke };
}
