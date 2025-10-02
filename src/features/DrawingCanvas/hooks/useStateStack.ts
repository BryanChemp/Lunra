import { useEffect, useRef } from "react";

export const useStateStack = (canvasRef:  React.RefObject<HTMLCanvasElement | null>) => {
	const undoStack = useRef<ImageData[]>([]);
	const redoStack = useRef<ImageData[]>([]);

    useEffect(() => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return
        const snapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        undoStack.current.push(snapshot)
    }, [])

	const saveState = () => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;
		const snapshot = ctx.getImageData(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		undoStack.current.push(snapshot);
		redoStack.current = [];
	};

	const undo = () => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;
		if (undoStack.current.length > 1) {
			const last = undoStack.current.pop()!;
			redoStack.current.push(last);
			const prev = undoStack.current[undoStack.current.length - 1];
			ctx.putImageData(prev, 0, 0);
		}
	};

	const redo = () => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;
		if (redoStack.current.length > 0) {
			const snapshot = redoStack.current.pop()!;
			undoStack.current.push(snapshot);
			ctx.putImageData(snapshot, 0, 0);
		}
	};

	return {
        undo,
        redo,
        saveState
    };
};
