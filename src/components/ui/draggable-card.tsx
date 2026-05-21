"use client";
import { cn } from "../../lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";

export const DraggableCardBody = ({
  className,
  children,
  onClick,
  style,
  animateProp,
  transitionProp,
  onDragEnd,
  dragConstraints,
  layoutId,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties | any;
  animateProp?: any;
  transitionProp?: any;
  onDragEnd?: (event: any, info: any) => void;
  dragConstraints?: any;
  layoutId?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [internalConstraints, setInternalConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const rectRef = useRef<{ width: number; height: number; left: number; top: number } | null>(null);
  const isDraggingRef = useRef(false);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-15, 15]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.15, 0, 0.15]),
    springConfig,
  );

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setInternalConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);

    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;

    if (!rectRef.current && cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }

    if (!rectRef.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = rectRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      drag
      dragConstraints={dragConstraints || internalConstraints}
      onDragStart={() => {
        isDraggingRef.current = true;
        document.body.style.cursor = "grabbing";
        mouseX.set(0);
        mouseY.set(0);
      }}
      onDragEnd={(event, info) => {
        isDraggingRef.current = false;
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        
        if (onDragEnd) {
          onDragEnd(event, info);
        } else {
          const currentVelocityX = velocityX.get();
          const currentVelocityY = velocityY.get();

          const velocityMagnitude = Math.sqrt(
            currentVelocityX * currentVelocityX +
              currentVelocityY * currentVelocityY,
          );
          const bounce = Math.min(0.8, velocityMagnitude / 1000);

          animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
            duration: 0.8,
            ease: [0.2, 0, 0, 1],
            bounce,
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 0.8,
          });

          animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
            duration: 0.8,
            ease: [0.2, 0, 0, 1],
            bounce,
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 0.8,
          });
        }
      }}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e: React.MouseEvent) => {
        const dx = e.clientX - pointerDownPos.current.x;
        const dy = e.clientY - pointerDownPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        
        if (onClick) onClick();
      }}
      style={{
        willChange: "transform",
        ...style,
      }}
      animate={animateProp}
      transition={transitionProp}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative select-none",
        className,
      )}
    >
      <motion.div
        animate={controls}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        className="w-full h-full flex flex-col relative overflow-hidden rounded-[12px]"
      >
        {children}
        <motion.div
          style={{
            opacity: glareOpacity,
          }}
          className="pointer-events-none absolute inset-0 bg-white select-none mix-blend-overlay z-20 rounded-[12px]"
        />
      </motion.div>
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:3000px]", className)}>{children}</div>
  );
};
