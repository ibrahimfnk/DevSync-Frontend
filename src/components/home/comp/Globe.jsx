import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useMotionValue, useSpring } from "framer-motion";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG = {
    width: 800,
    height: 800,
    onRender: () => {},
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: 80,
    diffuse: 0.4,
    mapSamples: 16000,
    mapBrightness: 1.8,
    baseColor: [1, 1, 1],
    markerColor: [251 / 255, 100 / 255, 21 / 255],
    glowColor: [1, 1, 1],
    markers: [
        { location: [18.990495184350813, 73.12765936695256], size: 0.1 },
    ],
};

export function Globe({ className, config = GLOBE_CONFIG }) {
    let phi = 0;
    let width = 0;
    const canvasRef = useRef(null);
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);

    const r = useMotionValue(0);
    const rs = useSpring(r, {
        mass: 1,
        damping: 30,
        stiffness: 100,
    });

    const updatePointerInteraction = (value) => {
        pointerInteracting.current = value;
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
        }
    };

    const updateMovement = (clientX) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(r.get() + delta / MOVEMENT_DAMPING);
        }
    };

    useEffect(() => {
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };

        window.addEventListener("resize", onResize);
        onResize();

        const globe = createGlobe(canvasRef.current, {
            ...config,
            width: width * 2,
            height: width * 2,
            onRender: (state) => {
                if (!pointerInteracting.current) phi += 0.005;
                state.phi = phi + rs.get();
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => (canvasRef.current.style.opacity = "1"), 0);
        return () => {
            globe.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, [rs, config]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleDoubleClick = () => {
            window.open(
                "https://www.google.com/maps/place/Pillai+College+of+Engineering,+New+Panvel+(Autonomous)/@18.990201,73.1250952,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7e866de88667f:0xc1c5d5badc610f5f!8m2!3d18.990201!4d73.1276701!16s%2Fm%2F0gjcvbf?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
                "_blank"
            );
        };

        canvas.addEventListener("dblclick", handleDoubleClick);
        return () => {
            canvas.removeEventListener("dblclick", handleDoubleClick);
        };
    }, []);

    return (
        <div
            className={`absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px] ${className}`}
        >
            <canvas
                className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX;
                    updatePointerInteraction(e.clientX);
                }}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={(e) => updateMovement(e.clientX)}
                onTouchMove={(e) =>
                    e.touches[0] && updateMovement(e.touches[0].clientX)
                }
            />
        </div>
    );
}
