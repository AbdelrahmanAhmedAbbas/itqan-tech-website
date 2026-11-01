import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMotion } from "../context/motion";
export default function PageMotion() {
  const { pathname } = useLocation();
  const { enabled } = useMotion();
  useEffect(() => {
    if (!enabled) return;
    let disposed = false,
      context,
      observer,
      frame,
      pointerFrame;
    const visible = new Set();
    const canvas = document.querySelector(".workflow-canvas");
    const pricing = document.querySelector(".offer-grid");
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const writes = [];
        for (const el of visible) {
          const b = el.getBoundingClientRect();
          const p = Math.max(
            -1,
            Math.min(1, (b.top + b.height / 2 - innerHeight / 2) / innerHeight),
          );
          writes.push([el, p]);
        }
        for (const [el, p] of writes)
          el.style.setProperty("--capture-drift", `${p * 30}px`);
        if (canvas) {
          const b = canvas.getBoundingClientRect();
          canvas.style.setProperty(
            "--workflow-shift",
            `${Math.max(-12, Math.min(12, (b.top / innerHeight) * 14))}px`,
          );
        }
        if (pricing) {
          const b = pricing.getBoundingClientRect();
          pricing.style.setProperty(
            "--line-progress",
            Math.max(
              0,
              Math.min(1, (innerHeight - b.top) / (innerHeight * 0.6)),
            ),
          );
        }
      });
    };
    const pointer = (event) => {
      if (!canvas || !matchMedia("(pointer:fine)").matches || pointerFrame)
        return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = null;
        const b = canvas.getBoundingClientRect();
        canvas.style.setProperty(
          "--tilt-y",
          `${-4 + ((event.clientX - b.left) / b.width) * 5}deg`,
        );
        canvas.style.setProperty(
          "--tilt-x",
          `${2 - ((event.clientY - b.top) / b.height) * 4}deg`,
        );
      });
    };
    const leave = () => {
      canvas?.style.removeProperty("--tilt-y");
      canvas?.style.removeProperty("--tilt-x");
    };
    import("gsap").then(({ gsap }) => {
      if (disposed) return;
      context = gsap.context(() => {
        gsap.fromTo(
          ".hero-copy > *",
          { y: 35 },
          {
            y: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "power4.out",
            clearProps: "transform",
          },
        );
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const el = entry.target;
              if (!entry.isIntersecting) {
                visible.delete(el);
                return;
              }
              if (el.matches(".capture-visual")) visible.add(el);
              if (el.dataset.motionEntered) return;
              el.dataset.motionEntered = "true";
              const index = [...el.parentElement.children].indexOf(el);
              const row = el.matches(".capability-row");
              const card = el.matches(
                ".pain-item,.offer-card,.case-feature,.process-grid>li",
              );
              context.add(() =>
                gsap.fromTo(
                  el,
                  {
                    y: row ? 0 : card ? 65 : 42,
                    scale: card ? 0.94 : 1,
                    rotation: card ? (index % 2 === 0 ? -2 : 2) : 0,
                    x: row ? (index % 2 === 0 ? -55 : 55) : 0,
                    opacity: row ? 0.2 : 0.15,
                  },
                  {
                    y: 0,
                    x: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: row ? 0.8 : 1.1,
                    delay: card ? Math.min(index, 4) * 0.1 : 0,
                    ease: "power4.out",
                    clearProps: "transform,opacity",
                  },
                ),
              );
            });
            scroll();
          },
          { threshold: 0.1 },
        );
        document
          .querySelectorAll(
            "main .section-heading,main .pain-item,main .solution-step,main .project-card,main .process-grid>li,main .case-feature,main .case-section-label,main .case-story-copy,main .capture-visual,main .faq-item,main .offer-card,main .capability-row,main .final-cta-copy, main .form-field, main .form-submit, footer .footer-links, footer .footer-contact",
          )
          .forEach((el) => observer.observe(el));
      });
      window.addEventListener("scroll", scroll, { passive: true });
      canvas?.addEventListener("pointermove", pointer);
      canvas?.addEventListener("pointerleave", leave);
      scroll();
    });
    return () => {
      disposed = true;
      observer?.disconnect();
      context?.revert();
      window.removeEventListener("scroll", scroll);
      canvas?.removeEventListener("pointermove", pointer);
      canvas?.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      leave();
      canvas?.style.removeProperty("--workflow-shift");
      pricing?.style.removeProperty("--line-progress");
      document
        .querySelectorAll("[data-motion-entered]")
        .forEach((el) => delete el.dataset.motionEntered);
      document
        .querySelectorAll(".capture-visual")
        .forEach((el) => el.style.removeProperty("--capture-drift"));
    };
  }, [pathname, enabled]);
  return null;
}
