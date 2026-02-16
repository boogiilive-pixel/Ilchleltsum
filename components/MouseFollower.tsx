
import React, { useEffect, useState, useRef } from 'react';

const MouseFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const followerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRef = useRef<number>(null);

  useEffect(() => {
    // Check if device has a mouse
    const canHover = window.matchMedia('(pointer: fine)').matches;
    if (!canHover) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON'
      );
    };

    const animate = () => {
      // Linear interpolation for smooth lag effect
      const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
      
      followerRef.current.x = lerp(followerRef.current.x, cursorRef.current.x, 0.15);
      followerRef.current.y = lerp(followerRef.current.y, cursorRef.current.y, 0.15);
      
      setPosition({ x: followerRef.current.x, y: followerRef.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Global Glow Background Follower */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(20, 184, 166, 0.03), transparent 80%)`,
        }}
      />

      {/* Main Cursor Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-teal-500 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
        style={{ 
          transform: `translate3d(${cursorRef.current.x}px, ${cursorRef.current.y}px, 0) scale(${isPointer ? 0 : 1})`,
        }}
      />

      {/* Trailing Ring */}
      <div 
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border ${
          isPointer 
            ? 'w-16 h-16 bg-teal-500/10 border-teal-500/20 scale-100' 
            : 'w-10 h-10 border-teal-500/30 scale-100'
        }`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
    </>
  );
};

export default MouseFollower;
