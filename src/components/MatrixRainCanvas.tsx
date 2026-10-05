import React, { useEffect, useRef } from 'react';

interface MatrixRainCanvasProps {
  opacity?: number;
  speed?: number; // 1 = normal
  colorMode?: 'dual' | 'red' | 'green' | 'rgb';
}

const CHARACTERS = '01SUMOAI23456789ABCDEF0101アイウエオカキクケコサシスセソタチツテトナニヌネハヒフヘホマミムメモヤユヨラリルレワヲン⚡⌘⌥∑∆λ';

export const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({
  opacity = 0.55,
  colorMode = 'dual',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);

    // Each column has: y position, speed, colorType, length
    interface RainDrop {
      y: number;
      speed: number;
      type: 'red' | 'green' | 'rgb';
      chars: string[];
    }

    const drops: RainDrop[] = [];

    const initDrops = () => {
      drops.length = 0;
      columns = Math.floor(width / fontSize);
      for (let i = 0; i < columns; i++) {
        const isRed = colorMode === 'red' ? true : colorMode === 'green' ? false : (i % 2 === 0);
        drops.push({
          y: Math.random() * -height,
          speed: 1.5 + Math.random() * 2.5,
          type: isRed ? 'red' : 'green',
          chars: Array.from({ length: 18 }, () =>
            CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
          ),
        });
      }
    };

    initDrops();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDrops();
    };

    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for buttery smooth and low CPU load

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Semi-transparent black clear to create fading trail
      ctx.fillStyle = 'rgba(5, 2, 4, 0.16)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'Space Grotesk', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;

        // Draw trail of characters
        for (let j = 0; j < drop.chars.length; j++) {
          const charY = drop.y - j * (fontSize + 2);
          if (charY < -fontSize || charY > height + fontSize) continue;

          // Head drop character is bright & glowing
          if (j === 0) {
            ctx.shadowBlur = 8;
            if (drop.type === 'red') {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ff003c';
            } else {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#00ff66';
            }
          } else if (j === 1) {
            ctx.shadowBlur = 4;
            if (drop.type === 'red') {
              ctx.fillStyle = '#ff6b8b';
              ctx.shadowColor = '#ef4444';
            } else {
              ctx.fillStyle = '#6ee7b7';
              ctx.shadowColor = '#10b981';
            }
          } else {
            // Tail fading characters
            ctx.shadowBlur = 0;
            const alpha = Math.max(0.08, 1 - j / drop.chars.length);
            if (drop.type === 'red') {
              ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
            } else {
              ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.8})`;
            }
          }

          // Randomly change a character in trail
          if (Math.random() < 0.03) {
            drop.chars[j] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
          }

          ctx.fillText(drop.chars[j], x, charY);
        }

        // Advance drop position
        drop.y += drop.speed * fontSize * 0.6;

        // Reset drop when past bottom screen
        if (drop.y - drop.chars.length * fontSize > height) {
          drop.y = Math.random() * -120;
          drop.speed = 1.5 + Math.random() * 2.5;
          // Alternate red and green drops
          drop.type = Math.random() > 0.5 ? 'red' : 'green';
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [colorMode]);

  return (
    <div
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none select-none z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
