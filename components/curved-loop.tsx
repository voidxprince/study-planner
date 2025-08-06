import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId,
  FC,
  PointerEvent,
} from "react";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-200,40 Q500,${40 + curveAmount} 1640,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  // Increase repetitions for seamless looping
  const totalText = textLength
    ? Array(Math.ceil(2400 / textLength) + 4)
        .fill(text)
        .join("")
    : text;

  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) {
      const length = measureRef.current.getComputedTextLength();
      setSpacing(length);
    }
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !ready) return;

    let frame = 0;
    let lastTime = performance.now();
    
    const step = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (!dragRef.current && textPathRef.current) {
        // Use time-based animation for smoother movement
        const delta = (dirRef.current === "right" ? speed : -speed) * (deltaTime / 16.67); // Normalize to 60fps
        const currentOffset = parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        // Improved wrapping logic for seamless looping
        while (newOffset <= -wrapPoint) newOffset += wrapPoint;
        while (newOffset >= wrapPoint) newOffset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", newOffset + "px");
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;

    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx * 0.8; // Smooth drag interaction

    const currentOffset = parseFloat(
      textPathRef.current.getAttribute("startOffset") || "0"
    );
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    while (newOffset <= -wrapPoint) newOffset += wrapPoint;
    while (newOffset >= wrapPoint) newOffset -= wrapPoint;

    textPathRef.current.setAttribute("startOffset", newOffset + "px");
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div className="w-full mb-12">
      <div
        className="w-full flex items-center justify-center"
        style={{ visibility: ready ? "visible" : "hidden", cursor: cursorStyle }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <svg
          className="select-none w-full overflow-visible block aspect-[100/12] text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-bold uppercase leading-none"
          viewBox="0 0 1440 120"
        >
          <text
            ref={measureRef}
            xmlSpace="preserve"
            style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
          >
            {text}
          </text>
          <defs>
            <path
              ref={pathRef}
              id={pathId}
              d={pathD}
              fill="none"
              stroke="transparent"
            />
          </defs>
          {ready && (
            <text xmlSpace="preserve" className={`fill-white ${className ?? ""}`}>
              <textPath
                ref={textPathRef}
                href={`#${pathId}`}
                startOffset={offset + "px"}
                xmlSpace="preserve"
              >
                {totalText}
              </textPath>
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default CurvedLoop;
