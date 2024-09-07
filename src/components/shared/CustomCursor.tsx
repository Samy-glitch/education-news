import { useEffect, useRef } from "react";

const CustomCursor = ({ isCursorHover }: { isCursorHover?: boolean }) => {
  const circleElement = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const previousMouse = useRef({ x: 0, y: 0 });
  const circle = useRef({ x: 0, y: 0 });
  const currentScale = useRef(0);
  const currentAngle = useRef(0);

  useEffect(() => {
    const speed = 0.17;

    const moveMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const tick = () => {
      if (!circleElement.current) return;

      circle.current.x += (mouse.current.x - circle.current.x) * speed;
      circle.current.y += (mouse.current.y - circle.current.y) * speed;

      const deltaMouseX = mouse.current.x - previousMouse.current.x;
      const deltaMouseY = mouse.current.y - previousMouse.current.y;

      previousMouse.current.x = mouse.current.x;
      previousMouse.current.y = mouse.current.y;

      const mouseVelocity = Math.min(
        Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4,
        150
      );

      const scaleValue = (mouseVelocity / 150) * 0.5;

      currentScale.current += (scaleValue - currentScale.current) * speed;

      const angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI;
      if (mouseVelocity > 20) {
        currentAngle.current = angle;
      }

      circleElement.current.style.transform = `translate(${
        circle.current.x
      }px, ${circle.current.y}px) rotate(${currentAngle.current}deg) scale(${
        1 + currentScale.current
      }, ${1 - currentScale.current})`;

      window.requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", moveMouse);

    tick();

    return () => {
      document.removeEventListener("mousemove", moveMouse);
    };
  }, []);

  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div
      ref={circleElement}
      data-hover={isCursorHover}
      className={`circle ${isTouchDevice() && "hidden"}`}
    >
      <div
        data-hover={isCursorHover}
        className="w-full h-full bg-transparent rounded-full border border-black transition-all mix-blend-screen data-[hover=true]:bg-[#8AF5E1]/70 data-[hover=true]:scale-[0.2] data-[hover=true]:border-0"
      ></div>
    </div>
  );
};

export default CustomCursor;
