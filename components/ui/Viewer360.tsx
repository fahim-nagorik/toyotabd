"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Plus, X } from "lucide-react";

export interface ViewerHotspot {
  id: string;
  title: string;
  body: string;
  /** Position as a fraction of the viewer, 0–1 from the top-left. */
  x: number;
  y: number;
  /**
   * 1-based inclusive frame range the hotspot is visible on.
   * May wrap around the sequence end, e.g. [30, 6].
   */
  frames: [number, number];
}

interface Viewer360Props {
  /** Frame URLs in rotation order. Paths are the asset contract — see PLAN.md §4. */
  frames: string[];
  /** 1-based frame to start on. */
  initialFrame?: number;
  hotspots?: ViewerHotspot[];
  /** Static image shown if the sequence fails to load. */
  fallbackSrc?: string;
  ariaLabel?: string;
  className?: string;
  /**
   * Drag distance multiplier. 1 = full viewer-width drag is one full
   * rotation (right for a real 36-frame set). Raise it for coarse interim
   * sets so a short drag still visibly changes the view.
   */
  sensitivity?: number;
}

const INERTIA_DECAY = 0.94;
const INERTIA_STOP = 0.02; // frames per tick

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Viewer360({
  frames,
  initialFrame = 1,
  hotspots = [],
  fallbackSrc,
  ariaLabel = "360 degree view of the vehicle. Drag, or press the left and right arrow keys, to rotate.",
  className,
  sensitivity = 1,
}: Viewer360Props) {
  const n = frames.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const posRef = useRef(initialFrame - 1); // float frame position
  const velRef = useRef(0); // frames per tick
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, pos: 0 });
  const lastMoveRef = useRef({ t: 0, pos: 0 });

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState(mod(initialFrame - 1, n)); // 0-based int
  const [dragging, setDragging] = useState(false);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Preload every frame before revealing. On a frame-set swap (color change)
  // the previous images keep rendering until the new set is fully loaded.
  const framesKey = frames.join("|");
  useEffect(() => {
    let cancelled = false;
    setStatus(imagesRef.current.length ? "ready" : "loading");
    setProgress(0);

    let settled = 0;
    let failed = 0;
    const imgs = frames.map((src) => {
      const img = new window.Image();
      img.decoding = "async";
      return Object.assign(img, { src });
    });

    const onSettle = (ok: boolean) => {
      if (cancelled) return;
      settled += 1;
      if (!ok) failed += 1;
      setProgress(settled / frames.length);
      if (settled === frames.length) {
        if (failed > 0) {
          setStatus("error");
        } else {
          imagesRef.current = imgs;
          setStatus("ready");
        }
      }
    };
    imgs.forEach((img) => {
      img.onload = () => onSettle(true);
      img.onerror = () => onSettle(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesKey]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[mod(Math.round(posRef.current), n)];
    if (!canvas || !ctx || !img?.naturalWidth) return;

    const { width: cw, height: ch } = canvas;
    // Cover-fit, centered.
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, [n]);

  // Keep the canvas backing store in sync with layout size and DPR.
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(entry.contentRect.width * dpr);
      canvas.height = Math.round(entry.contentRect.height * dpr);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // Single rAF loop: drag inertia + render.
  useEffect(() => {
    if (status !== "ready") return;
    let raf = 0;
    const tick = () => {
      // Manual rotation only — the viewer never moves on its own; drag
      // inertia is the single non-interactive motion.
      if (!draggingRef.current) {
        if (Math.abs(velRef.current) > INERTIA_STOP) {
          posRef.current += velRef.current;
          velRef.current *= INERTIA_DECAY;
        } else {
          velRef.current = 0;
        }
      }
      draw();
      const current = mod(Math.round(posRef.current), n);
      setFrame((prev) => (prev === current ? prev : current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, draw, n]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (status !== "ready") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    setInteracted(true);
    setOpenHotspot(null);
    velRef.current = 0;
    dragStartRef.current = { x: e.clientX, pos: posRef.current };
    lastMoveRef.current = { t: performance.now(), pos: posRef.current };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const width = containerRef.current?.clientWidth ?? 1;
    // Full-width drag = one full rotation: dx / (viewerWidth / frameCount),
    // scaled by `sensitivity` for coarse interim frame sets.
    const dx = (e.clientX - dragStartRef.current.x) * sensitivity;
    const next = dragStartRef.current.pos - dx / (width / n);

    const now = performance.now();
    const dt = now - lastMoveRef.current.t;
    if (dt > 0) {
      const instant = ((next - lastMoveRef.current.pos) / dt) * (1000 / 60);
      velRef.current = velRef.current * 0.6 + instant * 0.4;
    }
    lastMoveRef.current = { t: now, pos: next };
    posRef.current = next;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggingRef.current = false;
    setDragging(false);
    if (reducedMotion) velRef.current = 0; // no inertia spin
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (status !== "ready") return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setInteracted(true);
    velRef.current = 0;
    posRef.current =
      Math.round(posRef.current) + (e.key === "ArrowRight" ? 1 : -1);
  };

  const visibleHotspots = useMemo(() => {
    if (status !== "ready") return [];
    const f = frame + 1; // 1-based
    return hotspots.filter(({ frames: [start, end] }) =>
      start <= end ? f >= start && f <= end : f >= start || f <= end,
    );
  }, [hotspots, frame, status]);

  if (status === "error") {
    // Frames unavailable — degrade to a static hero image.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackSrc ?? frames[0]}
        alt="Vehicle exterior"
        className={clsx("aspect-video w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={1}
      aria-valuemax={n}
      aria-valuenow={frame + 1}
      aria-valuetext={`Frame ${frame + 1} of ${n}`}
      onKeyDown={onKeyDown}
      className={clsx(
        "relative aspect-video w-full select-none overflow-hidden",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-toyota-red",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={clsx(
          "absolute inset-0 h-full w-full",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ touchAction: "none" }}
      />

      {/* Discoverability hint — disappears after the first interaction. */}
      {status === "ready" && !interacted && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
          <span className="flex items-center gap-2 rounded-full border border-grey/60 bg-white/85 px-4 py-2 text-xs font-medium text-dark-grey shadow-sm backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v4h4" />
            </svg>
            {coarsePointer ? "Swipe" : "Drag"} to rotate — 360°
          </span>
        </div>
      )}

      {visibleHotspots.map((h) => (
        <div
          key={h.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
        >
          <button
            type="button"
            aria-label={h.title}
            aria-expanded={openHotspot === h.id}
            onClick={() =>
              setOpenHotspot((cur) => (cur === h.id ? null : h.id))
            }
            className="hit-44 flex size-8 items-center justify-center rounded-full border border-grey bg-white/90 text-dark-grey shadow-sm transition-transform duration-200 hover:scale-110"
          >
            <Plus className="size-4" />
          </button>
          {openHotspot === h.id && (
            <div className="absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-lg border border-light-grey bg-white p-4 text-left shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-black">{h.title}</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpenHotspot(null)}
                  className="hit-44 text-muted hover:text-black"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {h.body}
              </p>
            </div>
          )}
        </div>
      ))}

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-off-white">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Loading 360 view"
            className="h-0.5 w-48 overflow-hidden rounded-full bg-grey/60"
          >
            <div
              className="h-full bg-toyota-red transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
