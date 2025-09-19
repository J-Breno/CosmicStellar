import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollAnimationProps {
  targets: unknown;
  scrollTrigger?: ScrollTrigger.Vars;
}

export const useScrollAnimation = () => {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {});

    return () => {
      ctx.current?.revert();
      ctx.current = null;
    };
  }, []);

  const createAnimation = (animation: gsap.TweenVars, props?: ScrollAnimationProps) => {
    if (ctx.current) {
      return ctx.current.add(() => {
        const tl = gsap.timeline({
          scrollTrigger: props?.scrollTrigger || {
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
            markers: false
          }
        });

        tl.to(props?.targets || {}, animation);
        return tl;
      });
    }
    return null;
  };

  const createParallax = (targets: unknown, yPercent: number, depth: number = 1) => {
    return createAnimation(
      {
        yPercent,
        ease: 'none'
      },
      {
        targets,
        scrollTrigger: {
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
          markers: false
        }
      }
    );
  };

  const createBackgroundParallax = (targets: unknown, intensity: number = 0.5) => {
    return createAnimation(
      {
        y: `+=${100 * intensity}`,
        ease: 'none'
      },
      {
        targets,
        scrollTrigger: {
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
          markers: false
        }
      }
    );
  };

  return {
    createAnimation,
    createParallax,
    createBackgroundParallax
  };
};

export default useScrollAnimation;