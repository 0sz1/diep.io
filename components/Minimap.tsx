import React, { useRef, useEffect } from 'react';
import { Player, Shape } from '../types';
import { SHAPE_COLORS } from '../constants';

interface MinimapProps {
    player: Player;
    shapes: Shape[];
    worldWidth: number;
    worldHeight: number;
    cameraView: { x: number; y: number; width: number; height: number };
    boss: Shape | null;
}

const MINIMAP_SIZE = 140;

const Minimap: React.FC<MinimapProps> = ({ player, shapes, worldWidth, worldHeight, cameraView, boss }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const scaleX = MINIMAP_SIZE / worldWidth;
        const scaleY = MINIMAP_SIZE / worldHeight;

        // Clear canvas
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
        
        // Draw shapes
        shapes.forEach(shape => {
            ctx.fillStyle = SHAPE_COLORS[shape.type];
            const size = 2;
            ctx.fillRect(shape.position.x * scaleX - size / 2, shape.position.y * scaleY - size / 2, size, size);
        });

        // Draw boss
        if (boss) {
            ctx.fillStyle = SHAPE_COLORS[boss.type];
            const bossSize = 6;
            ctx.fillRect(boss.position.x * scaleX - bossSize / 2, boss.position.y * scaleY - bossSize / 2, bossSize, bossSize);
        }
        
        // Draw player
        ctx.fillStyle = '#00bfff';
        const playerSize = 4;
        ctx.fillRect(player.position.x * scaleX - playerSize / 2, player.position.y * scaleY - playerSize / 2, playerSize, playerSize);
        
        // Draw camera view
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cameraView.x * scaleX, cameraView.y * scaleY, cameraView.width * scaleX, cameraView.height * scaleY);

    }, [player, shapes, worldWidth, worldHeight, cameraView, boss]);

    return (
        <div className="absolute bottom-5 right-5 border-2 border-gray-500 rounded-md overflow-hidden backdrop-blur-sm">
            <canvas ref={canvasRef} width={MINIMAP_SIZE} height={MINIMAP_SIZE} />
        </div>
    );
};

export default Minimap;