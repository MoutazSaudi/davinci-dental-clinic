"use client";

import { useEffect, useRef, useState } from "react";

interface VideoShowcaseProps {
  locale: "ar" | "en";
  src: string;
  poster?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  autoPlayOnView?: boolean;
  aspectRatio?: "16/9" | "4/3" | "21/9" | "1/1";
}

export function VideoShowcase({
  locale,
  src,
  poster,
  eyebrow,
  title,
  description,
  autoPlayOnView = true,
  aspectRatio = "16/9",
}: VideoShowcaseProps) {
  const isArabic = locale === "ar";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // تشغيل تلقائي عند الدخول للشاشة
  useEffect(() => {
    if (!autoPlayOnView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoPlayOnView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlayOnView) return;

    if (isInView && !hasStarted) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          /* رفض المتصفح التشغيل التلقائي */
        });
    }
  }, [isInView, autoPlayOnView, hasStarted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen?.();
    }
  };

  return (
    <section className="video-showcase">
      {(eyebrow || title || description) && (
        <header className="video-showcase__header">
          {eyebrow && <p className="video-showcase__eyebrow">{eyebrow}</p>}
          {title && <h2 className="video-showcase__title">{title}</h2>}
          {description && (
            <p className="video-showcase__description">{description}</p>
          )}
        </header>
      )}

      <div
        ref={containerRef}
        className={`video-showcase__frame video-showcase__frame--${aspectRatio.replace(
          "/",
          "-"
        )}`}
      >
        <video
          ref={videoRef}
          className="video-showcase__video"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="video-showcase__gradient" aria-hidden="true" />

        {!hasStarted && (
          <button
            type="button"
            className="video-showcase__play-big"
            onClick={togglePlay}
            aria-label={isArabic ? "تشغيل الفيديو" : "Play video"}
          >
            <span className="video-showcase__play-icon" aria-hidden="true">
              ▶
            </span>
          </button>
        )}

        <div className="video-showcase__controls">
          <button
            type="button"
            className="video-showcase__control"
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? isArabic ? "إيقاف مؤقت" : "Pause"
                : isArabic ? "تشغيل" : "Play"
            }
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <button
            type="button"
            className="video-showcase__control"
            onClick={toggleMute}
            aria-label={
              isMuted
                ? isArabic ? "إلغاء الكتم" : "Unmute"
                : isArabic ? "كتم الصوت" : "Mute"
            }
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          <button
            type="button"
            className="video-showcase__control"
            onClick={toggleFullscreen}
            aria-label={isArabic ? "ملء الشاشة" : "Fullscreen"}
          >
            ⛶
          </button>
        </div>
      </div>
    </section>
  );
}