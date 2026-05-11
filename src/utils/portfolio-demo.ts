import {
  $,
  useSignal,
  useVisibleTask$,
  type QRL,
  type Signal,
} from "@builder.io/qwik";

import {
  FCC_TEST_SCRIPT_ID,
  FCC_TEST_SCRIPT_SRC,
  resetFccTestSuiteUI,
} from "~/utils/fcc-test-suite";

export type DemoLoadState = {
  isLoading: Signal<boolean>;
  errorMessage: Signal<string | null>;
  refreshCounter: Signal<number>;
  handleRefresh: QRL<() => void>;
};

export type ResponsiveChartContext = {
  svgElement: SVGSVGElement;
  tooltipElement: HTMLDivElement;
  wrapperElement: HTMLElement;
};

export type FccTestLoader = () => () => void;

type FetchJsonOptions = {
  signal?: AbortSignal;
};

type BindResponsiveChartOptions = {
  wrapperElement: HTMLElement;
  renderChart: () => void;
  cleanupChart?: () => void;
};

const triggerDomContentLoaded = () => {
  if (document.readyState !== "loading") {
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
};

export const useDemoLoadState = (): DemoLoadState => {
  const isLoading = useSignal(true);
  const errorMessage = useSignal<string | null>(null);
  const refreshCounter = useSignal(0);

  const handleRefresh = $(() => {
    isLoading.value = true;
    errorMessage.value = null;
    refreshCounter.value++;
  });

  return {
    isLoading,
    errorMessage,
    refreshCounter,
    handleRefresh,
  };
};

export const fetchJson = async <Payload>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<Payload> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as Payload;
};

export const createFccTestLoader = (): FccTestLoader => {
  return () => {
    resetFccTestSuiteUI();

    const existingScript = document.getElementById(
      FCC_TEST_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const handleLoad = () => {
      triggerDomContentLoaded();
    };

    const script = existingScript ?? document.createElement("script");
    const createdScript = existingScript === null;

    if (existingScript) {
      triggerDomContentLoaded();
    } else {
      script.id = FCC_TEST_SCRIPT_ID;
      script.src = FCC_TEST_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", handleLoad);
      document.body.appendChild(script);
    }

    return () => {
      if (createdScript) {
        script.removeEventListener("load", handleLoad);
      }
      if (script.isConnected) {
        script.remove();
      }
      resetFccTestSuiteUI();
    };
  };
};

export const useFccTestLoader = () => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => createFccTestLoader()());
};

export const bindResponsiveChart = ({
  wrapperElement,
  renderChart,
  cleanupChart,
}: BindResponsiveChartOptions) => {
  renderChart();

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => {
      renderChart();
    });
    observer.observe(wrapperElement);

    return () => {
      observer.disconnect();
      cleanupChart?.();
    };
  }

  const handleResize = () => {
    renderChart();
  };
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    cleanupChart?.();
  };
};
