import React, { useEffect, useRef } from 'react';
import { LiveState } from '../types';
import { AudioStreamer } from '../services/AudioStreamer';

interface WaveformCanvasProps {
  state: LiveState;
  streamer: AudioStreamer;
  micVolume: number;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  state,
  streamer,
  micVolume,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      phaseRef.current += 0.06;
      const phase = phaseRef.current;

      if (state === 'speaking') {
        // Red-Green RGB Audio Waveform Output
        const waveform = streamer.getWaveformData();
        const freqData = streamer.getFrequencyData();

        const points = 64;
        const sliceWidth = width / points;

        // Line 1: Neon Crimson Laser (Red Hacking Line)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ff003c';
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#ff003c';

        for (let i = 0; i < points; i++) {
          const x = i * sliceWidth;
          let offset = 0;

          if (waveform.length > 0) {
            const dataIndex = Math.floor((i / points) * waveform.length);
            const val = (waveform[dataIndex] - 128) / 128.0;
            offset = val * (height * 0.44);
          } else {
            offset = Math.sin(phase + i * 0.28) * 16;
          }

          const y = centerY + offset;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Line 2: Matrix Cyber Green Laser (Green Hacking Line)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff88';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#10b981';

        for (let i = 0; i < points; i++) {
          const x = i * sliceWidth;
          let offset = 0;
          if (freqData.length > 0) {
            const dataIndex = Math.floor((i / points) * freqData.length);
            const val = (freqData[dataIndex] / 255.0) - 0.5;
            offset = val * (height * 0.38);
          } else {
            offset = Math.cos(phase * 1.3 + i * 0.32) * 13;
          }
          const y = centerY - offset;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Line 3: Cyan RGB Harmonic Pulse
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#06b6d4';

        for (let i = 0; i < points; i += 2) {
          const x = i * sliceWidth;
          const y = centerY + Math.sin(phase * 2 + i * 0.5) * 8;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (state === 'listening') {
        // Red & Green Dual Mic Scanning Wave
        const points = 48;
        const sliceWidth = width / points;
        const intensity = Math.min(1, micVolume * 4);

        // Red primary line
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = intensity > 0.05 ? '#ff1744' : '#ef4444';
        ctx.shadowBlur = intensity > 0.05 ? 16 : 8;
        ctx.shadowColor = '#ff003c';

        for (let i = 0; i < points; i++) {
          const x = i * sliceWidth;
          const wave1 = Math.sin(phase * 1.5 + i * 0.3) * (5 + intensity * 24);
          const y = centerY + wave1;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Green secondary cyber wave
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = intensity > 0.05 ? '#00ff88' : '#10b981';
        ctx.shadowBlur = intensity > 0.05 ? 14 : 6;
        ctx.shadowColor = '#10b981';

        for (let i = 0; i < points; i++) {
          const x = i * sliceWidth;
          const wave2 = Math.cos(phase * 1.2 + i * 0.25) * (4 + intensity * 18);
          const y = centerY - wave2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Central RGB target pulse nodes
        if (intensity > 0.05) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 16;
          ctx.shadowColor = '#00ff88';
          ctx.beginPath();
          ctx.arc(width / 2, centerY, 4 + intensity * 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ff003c';
          ctx.shadowColor = '#ff003c';
          ctx.beginPath();
          ctx.arc(width / 2 - 20, centerY, 2.5 + intensity * 2, 0, Math.PI * 2);
          ctx.arc(width / 2 + 20, centerY, 2.5 + intensity * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (state === 'thinking') {
        // Red & Green calculation wave
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff88';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#10b981';

        const steps = 32;
        const stepWidth = width / steps;
        for (let i = 0; i < steps; i++) {
          const x = i * stepWidth;
          const y = centerY + Math.sin(phase * 4 + i) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ff003c';
        ctx.shadowColor = '#ff003c';
        for (let i = 0; i < steps; i++) {
          const x = i * stepWidth;
          const y = centerY - Math.cos(phase * 4 + i) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Idle Red-Green laser line
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
        ctx.moveTo(0, centerY);
        ctx.lineTo(width / 2, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
        ctx.moveTo(width / 2, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Pulsing RGB particle on idle line
        const blipX = ((phase * 45) % (width + 40)) - 20;
        if (blipX > 0 && blipX < width) {
          ctx.beginPath();
          ctx.arc(blipX, centerY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = blipX > width / 2 ? '#00ff88' : '#ff003c';
          ctx.shadowBlur = 10;
          ctx.shadowColor = blipX > width / 2 ? '#10b981' : '#ff003c';
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, streamer, micVolume]);

  return (
    <div className="relative w-72 sm:w-88 h-16 flex items-center justify-center pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        width={352}
        height={64}
        className="w-full h-full"
      />
    </div>
  );
};
