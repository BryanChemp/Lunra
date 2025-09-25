import { useRef, useState, useEffect } from "react";

type Brush = {
    size: number;
    color: string;
    opacity?: number;
    shape?: HTMLImageElement | "circle" | "square";
    spacing?: number;
};

const defaultBrush: Brush = {
    size: 10,
    color: "#4C6EF5",
    opacity: 1,
    shape: "circle",
    spacing: 1
};

const DrawingCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brush, setBrush] = useState<Brush>(defaultBrush);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

    const startDrawing = (e: React.MouseEvent) => {
        setIsDrawing(true);
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!lastPos) {
            setLastPos({ x, y });
            return;
        }

        const dx = x - lastPos.x;
        const dy = y - lastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const spacing = brush.spacing || 1;

        for (let i = 0; i < dist; i += spacing) {
            const t = i / dist;
            const ix = lastPos.x + dx * t;
            const iy = lastPos.y + dy * t;

            ctx.globalAlpha = brush.opacity || 1;

            if (brush.shape instanceof HTMLImageElement) {
                ctx.drawImage(
                    brush.shape,
                    ix - brush.size / 2,
                    iy - brush.size / 2,
                    brush.size,
                    brush.size
                );
            } else if (brush.shape === "square") {
                ctx.fillStyle = brush.color;
                ctx.fillRect(ix - brush.size / 2, iy - brush.size / 2, brush.size, brush.size);
            } else {
                ctx.fillStyle = brush.color;
                ctx.beginPath();
                ctx.arc(ix, iy, brush.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        }

        setLastPos({ x, y });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: "1px solid #ccc", cursor: "crosshair" }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
            />
            <div style={{ marginTop: 16 }}>
                <label>
                    Tamanho:
                    <input
                        type="range"
                        min={1}
                        max={50}
                        value={brush.size}
                        onChange={(e) => setBrush({ ...brush, size: Number(e.target.value) })}
                    />
                </label>
                <label style={{ marginLeft: 16 }}>
                    Cor:
                    <input
                        type="color"
                        value={brush.color}
                        onChange={(e) => setBrush({ ...brush, color: e.target.value })}
                    />
                </label>
                <label style={{ marginLeft: 16 }}>
                    Opacidade:
                    <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={brush.opacity}
                        onChange={(e) => setBrush({ ...brush, opacity: Number(e.target.value) })}
                    />
                </label>
            </div>
        </div>
    );
};

export default DrawingCanvas;