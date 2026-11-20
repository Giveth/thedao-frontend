import { animate, useInView, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useEffect, useRef } from 'react';

/** How long the count takes to ease up to `floor` while the value is still loading. */
const CREEP_SECONDS = 12;

interface RisingNumberProps {
  /** The real value; undefined while it is loading. */
  value: number | undefined;
  /** Where the count starts. */
  from: number;
  /**
   * While the value is unknown the count climbs slowly toward this, so it is
   * already moving when the data lands. Keep it safely below any likely value,
   * or the count will turn around and go down.
   */
  floor: number;
  /** The number and the text after it (e.g. a unit) for a given count. */
  format: (n: number) => [number: string, suffix: string];
  className?: string;
  suffixClassName?: string;
}

/**
 * A count-up that starts before its value is known: from `from` toward
 * `floor` (dimmed, as it is not the real number yet), then on to `value` once
 * it arrives. The spring keeps the count's current speed, so the hand-off is
 * one continuous motion. Later changes (refetches) count to the new value.
 * Nothing shows until the count starts, so the prerendered page never shows a
 * placeholder like "0 ETH". The number is an inline-block, so the empty line
 * keeps its height.
 */
export default function RisingNumber({ value, from, floor, format, className = '', suffixClassName = '' }: RisingNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(numberRef, { once: true });
  const count = useMotionValue(from);

  useMotionValueEvent(count, 'change', (n) => {
    const [number, suffix] = format(n);
    if (numberRef.current) numberRef.current.textContent = number;
    if (suffixRef.current) suffixRef.current.textContent = suffix;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = value === undefined
      ? animate(count, floor, { duration: CREEP_SECONDS, ease: 'easeOut' })
      : animate(count, value, { type: 'spring', bounce: 0, duration: 1 });
    return () => controls.stop();
  }, [inView, value, floor, count]);

  return (
    <>
      <span
        ref={numberRef}
        className={`transition-opacity duration-500 ${value === undefined ? 'opacity-50' : ''} ${className}`}
      />
      <span ref={suffixRef} className={suffixClassName} />
    </>
  );
}
