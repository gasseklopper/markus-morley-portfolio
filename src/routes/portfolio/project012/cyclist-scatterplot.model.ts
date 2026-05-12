export interface RawCyclistDatum {
  Name: string;
  Nationality: string;
  Year: number;
  Time: string;
  Doping: string;
}

export interface CyclistDatum {
  name: string;
  nationality: string;
  year: number;
  time: Date;
  timeLabel: string;
  doping: string;
}

export interface ScatterplotLegendItem {
  label: string;
  className: string;
}

export const scatterplotLegendItems: ScatterplotLegendItem[] = [
  { label: "Riders with doping allegations", className: "dot--doping" },
  { label: "No doping allegations", className: "dot--clean" },
];

export const parseCyclistData = (payload: RawCyclistDatum[]): CyclistDatum[] =>
  payload.map((item) => {
    const [minutes, seconds] = item.Time.split(":").map(Number);
    const time = new Date(Date.UTC(1970, 0, 1, 0, minutes, seconds));

    return {
      name: item.Name,
      nationality: item.Nationality,
      year: item.Year,
      time,
      timeLabel: item.Time,
      doping: item.Doping,
    };
  });

export const getScatterplotDimensions = (
  measuredWidth: number,
  maxWidth: number,
  minWidth: number,
  compactBreakpoint: number,
  compactHeight: number,
  fullHeight: number,
) => {
  const width = Math.min(maxWidth, Math.max(measuredWidth, minWidth));
  const isCompact = width < compactBreakpoint;
  return {
    width,
    isCompact,
    height: isCompact ? compactHeight : fullHeight,
  };
};
