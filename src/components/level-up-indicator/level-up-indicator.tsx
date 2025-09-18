import { $, component$, useSignal, useStylesScoped$, useVisibleTask$, type QRL, type Signal } from "@builder.io/qwik";
import { Portal } from "@builder.io/qwik-city";
import styles from "./level-up-indicator.css?inline";
import { getNextDelay } from "./get-next-delay";
import { useReducedMotion } from "~/utils/use-reduced-motion";

/**
 * LevelUpIndicator overlay
 * -------------------------
 * Drop the component anywhere in the app – it portals a fixed overlay at the viewport edges.
 * Theme via CSS variables on the host element:
 *   --hud-color, --hud-opacity, --hud-blur, --hud-line-w, --hud-z-index
 */

export type LevelUpIntensity = "subtle" | "default" | "loud";

export interface LevelUpIndicatorHandle {
  /** Imperative celebrate helper. */
  celebrate: QRL<() => void>;
}

export interface LevelUpIndicatorProps {
  /** Visual weight preset for the HUD effect. Defaults to "default". */
  intensity?: LevelUpIntensity;
  /** Accent color for the glow. Defaults to `#65f0ff`. */
  color?: string;
  /** When false, renders nothing. */
  enabled?: boolean;
  /** Minimum delay between bursts in milliseconds. Defaults to 6000. */
  intervalMinMs?: number;
  /** Maximum delay between bursts in milliseconds. Defaults to 8000. */
  intervalMaxMs?: number;
  /** Optional aria-live mode. Set to "polite" (or "assertive") to announce "Level up!". */
  ariaLive?: "off" | "polite" | "assertive";
  /** Override z-index for the overlay. Defaults to 9999. */
  zIndex?: number;
  /** Optional ref to imperatively trigger celebration bursts. */
  celebrateRef?: Signal<LevelUpIndicatorHandle | undefined>;
}

const INTENSITY_PRESETS: Record<LevelUpIntensity, { opacity: number; blur: string; line: string }> = {
  subtle: {
    opacity: 0.28,
    blur: "18px",
    line: "1px",
  },
  default: {
    opacity: 0.45,
    blur: "24px",
    line: "1.6px",
  },
  loud: {
    opacity: 0.65,
    blur: "32px",
    line: "2.2px",
  },
};

const CELEBRATE_ATTR = "data-celebrate";

export const LevelUpIndicator = component$<LevelUpIndicatorProps>((props) => {
  const intensityKey = props.intensity ?? "default";
  const color = props.color ?? "#65f0ff";
  const ariaLiveMode = props.ariaLive ?? "off";
  const zIndex = props.zIndex ?? 9999;
  const preset = INTENSITY_PRESETS[intensityKey] ?? INTENSITY_PRESETS.default;

  const reducedMotion = useReducedMotion();
  useStylesScoped$(styles);

  const hostRef = useSignal<HTMLDivElement>();
  const isBursting = useSignal(false);
  const burstDuration = useSignal(460);
  const leftDelay = useSignal(0);
  const rightDelay = useSignal(80);
  const leftOffset = useSignal(0);
  const rightOffset = useSignal(0);
  const leftJitter = useSignal<[number, number]>([0, 0]);
  const rightJitter = useSignal<[number, number]>([0, 0]);
  const announceTick = useSignal(0);

  const delayTimer = useSignal<ReturnType<typeof setTimeout> | null>(null);
  const burstTimer = useSignal<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useSignal<number | null>(null);

  const triggerBurst = $(() => {
    if (!(props.enabled ?? true) || reducedMotion.value) {
      return;
    }

    const randomSigned = (range: number) => (Math.random() * 2 - 1) * range;

    const duration = Math.round(getNextDelay(350, 600));
    const stagger = Math.round(getNextDelay(40, 120));
    const leftLeads = Math.random() > 0.5;

    burstDuration.value = duration;
    leftDelay.value = leftLeads ? 0 : stagger;
    rightDelay.value = leftLeads ? stagger : 0;
    leftOffset.value = Math.round(randomSigned(20));
    rightOffset.value = Math.round(randomSigned(20));
    leftJitter.value = [randomSigned(3), randomSigned(2)];
    rightJitter.value = [randomSigned(3), randomSigned(2)];

    if (rafId.value !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(rafId.value);
      rafId.value = null;
    }

    const startBurst = () => {
      if (burstTimer.value) {
        clearTimeout(burstTimer.value);
        burstTimer.value = null;
      }
      isBursting.value = true;
      if (ariaLiveMode !== "off") {
        announceTick.value++;
      }
      const total = duration + Math.max(leftDelay.value, rightDelay.value) + 60;
      burstTimer.value = setTimeout(() => {
        isBursting.value = false;
      }, total);
    };

    if (typeof requestAnimationFrame === "function") {
      rafId.value = requestAnimationFrame(() => {
        startBurst();
        rafId.value = null;
      });
    } else {
      startBurst();
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => props.enabled);
    track(() => props.intervalMinMs);
    track(() => props.intervalMaxMs);
    track(() => reducedMotion.value);

    if (delayTimer.value) {
      clearTimeout(delayTimer.value);
      delayTimer.value = null;
    }

    if (!(props.enabled ?? true) || reducedMotion.value) {
      isBursting.value = false;
      return;
    }

    const schedule = () => {
      const delay = Math.round(
        getNextDelay(props.intervalMinMs ?? 6000, props.intervalMaxMs ?? 8000),
      );
      delayTimer.value = setTimeout(() => {
        void triggerBurst();
        schedule();
      }, delay);
    };

    schedule();

    cleanup(() => {
      if (delayTimer.value) {
        clearTimeout(delayTimer.value);
        delayTimer.value = null;
      }
      if (burstTimer.value) {
        clearTimeout(burstTimer.value);
        burstTimer.value = null;
      }
      if (rafId.value !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafId.value);
        rafId.value = null;
      }
    });
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => hostRef.value);

    const hostEl = hostRef.value;
    if (!hostEl) {
      return;
    }

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes" && record.attributeName === CELEBRATE_ATTR) {
          void triggerBurst();
          hostEl.removeAttribute(CELEBRATE_ATTR);
        }
      }
    });

    observer.observe(hostEl, { attributes: true, attributeFilter: [CELEBRATE_ATTR] });
    cleanup(() => observer.disconnect());
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!props.celebrateRef) {
      return;
    }
    props.celebrateRef.value = {
      celebrate: triggerBurst,
    };
    cleanup(() => {
      if (props.celebrateRef) {
        props.celebrateRef.value = undefined;
      }
    });
  });

  if (!(props.enabled ?? true)) {
    return null;
  }

  const styleMap: Record<string, string> = {
    "--hud-color": color,
    "--hud-opacity": preset.opacity.toString(),
    "--hud-blur": preset.blur,
    "--hud-line-w": preset.line,
    "--hud-z-index": String(zIndex),
    "--burst-duration": `${burstDuration.value}ms`,
    "--burst-left-delay": `${leftDelay.value}ms`,
    "--burst-right-delay": `${rightDelay.value}ms`,
    "--burst-left-offset": `${leftOffset.value}px`,
    "--burst-right-offset": `${rightOffset.value}px`,
    "--burst-left-jitter-1": `${leftJitter.value[0]}px`,
    "--burst-left-jitter-2": `${leftJitter.value[1]}px`,
    "--burst-right-jitter-1": `${rightJitter.value[0]}px`,
    "--burst-right-jitter-2": `${rightJitter.value[1]}px`,
  };

  return (
    <Portal>
      <div
        ref={hostRef}
        class="level-up-indicator"
        style={styleMap}
        data-reduced={reducedMotion.value ? "true" : "false"}
        data-active={isBursting.value ? "true" : "false"}
      >
        <div class="edge edge-left">
          <div class="line line-core" />
          <div class="line line-glow" />
          <div class="line line-rgb" />
        </div>
        <div class="edge edge-right">
          <div class="line line-core" />
          <div class="line line-glow" />
          <div class="line line-rgb" />
        </div>
        {ariaLiveMode !== "off" && (
          <span class="screen-reader-only" aria-live={ariaLiveMode} aria-atomic="true">
            {announceTick.value > 0 ? `Level up! ${announceTick.value}` : ""}
          </span>
        )}
      </div>
    </Portal>
  );
});

export default LevelUpIndicator;
