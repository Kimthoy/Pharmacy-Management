import React, { useMemo } from "react";
import { Link } from "react-router-dom";

/**
 * Backwards-compatible props:
 *  - icon: Icon
 *  - title: string
 *  - value: ReactNode
 *  - bgColor: string (Tailwind class)
 *  - textColor: string (Tailwind class)
 *  - borderColor: string (Tailwind class)
 *
 * New optional props:
 *  - subtitle?: string
 *  - description?: string
 *  - badge?: { text: string, tone?: "green"|"blue"|"yellow"|"red"|"gray" }
 *  - progress?: number (0..100)
 *  - sparklineData?: number[]   // renders a tiny chart
 *  - changePercent?: number     // e.g., +12.3 or -4.5
 *  - changeLabel?: string       // e.g., "vs last week"
 *  - linkLabel?: string
 *  - linkTo?: string
 *  - footer?: React.ReactNode
 *  - loading?: boolean
 *  - error?: string
 *  - valuePrefix?: string       // e.g., "$"
 *  - valueSuffix?: string       // e.g., " items"
 *  - valueTooltip?: string
 *  - ariaLabel?: string
 *  - onClick?: () => void
 */

const toneClasses = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  gray: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function Sparkline({ data }) {
  if (!Array.isArray(data) || data.length < 2) return null;
  const width = 100;
  const height = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = (i * stepX).toFixed(2);
      const y = (height - ((d - min) / range) * height).toFixed(2);
      return `${x},${y}`;
    })
    .join(" ");

  // Fill area for a little polish
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-10 mt-2"
      aria-hidden="true"
    >
      <polyline points={areaPoints} fill="currentColor" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const StatsCard = ({
  icon: Icon,
  title,
  value,
  bgColor,
  textColor,
  borderColor,

  // new (optional)
  subtitle,
  description,
  badge,
  progress,
  sparklineData,
  changePercent,
  changeLabel,
  linkLabel,
  linkTo,
  footer,
  loading = false,
  error = "",
  valuePrefix,
  valueSuffix,
  valueTooltip,
  ariaLabel,
  onClick,
}) => {
  const clickable = Boolean(onClick || linkTo);

  const wrapperClass = `
    p-4 rounded-lg shadow-lg sm:shadow-lg transition-all text-center border
    ${bgColor || "bg-white dark:bg-gray-800"}
    ${borderColor || "border-gray-200 dark:border-gray-700"}
    ${clickable ? "cursor-pointer hover:shadow-xl" : ""}
  `;

  const trend = useMemo(() => {
    if (typeof changePercent !== "number") return null;
    const up = changePercent >= 0;
    const sign = up ? "+" : "";
    const color = up
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";
    const arrow = up ? "▲" : "▼";
    return { up, color, text: `${arrow} ${sign}${changePercent.toFixed(1)}%` };
  }, [changePercent]);

  const valueEl = (
    <h3
      className={`text-xl font-semibold mt-2 ${
        textColor || "text-gray-900 dark:text-gray-100"
      }`}
      title={valueTooltip}
    >
      {valuePrefix}
      {value}
      {valueSuffix}
    </h3>
  );

  const body = (
    <>
      {/* Icon + title row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon
              className={`sm:h-6 h-8 sm:w-6 w-8 ${textColor || "text-white"}`}
              aria-hidden="true"
            />
          ) : null}
          <div className="text-left">
            <p
              className={`text-sm ${
                textColor || "text-white"
              }/90 dark:text-gray-100/90`}
            >
              {title}
            </p>
            {subtitle ? (
              <p className="text-xs text-white/80 dark:text-gray-300/80">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {badge?.text ? (
          <span
            className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
              toneClasses[badge.tone || "gray"]
            }`}
          >
            {badge.text}
          </span>
        ) : null}
      </div>

      {/* Main value */}
      {valueEl}

      {/* Trend */}
      {trend ? (
        <div className={`mt-1 text-xs ${trend.color}`}>
          {trend.text}
          {changeLabel ? (
            <span className="text-[11px] text-white/70 dark:text-gray-300/70 ml-1">
              {changeLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Progress bar */}
      {typeof progress === "number" ? (
        <div className="mt-3">
          <div className="h-2 w-full rounded bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-2 rounded bg-black/30 dark:bg-white/40"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-white/80 dark:text-gray-300/80">
            {progress}% complete
          </div>
        </div>
      ) : null}

      {/* Sparkline */}
      {Array.isArray(sparklineData) && sparklineData.length > 1 ? (
        <div
          className={`${
            textColor?.includes("text-white")
              ? "text-white"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          <Sparkline data={sparklineData} />
        </div>
      ) : null}

      {/* Description */}
      {description ? (
        <p className="mt-2 text-xs text-white/90 dark:text-gray-200/90">
          {description}
        </p>
      ) : null}

      {/* Link / Footer */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {linkLabel && linkTo ? (
          <Link
            to={linkTo}
            className="text-xs underline text-black/80 dark:text-gray-200 hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            {linkLabel}
          </Link>
        ) : null}
        {footer ? (
          <div className="text-xs text-white/80 dark:text-gray-300/80">
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div
      className={wrapperClass}
      role={clickable ? "button" : "region"}
      aria-label={ariaLabel || title}
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-24 mx-auto rounded bg-white/30 dark:bg-gray-700" />
          <div className="h-7 w-36 mx-auto rounded bg-white/40 dark:bg-gray-600" />
          <div className="h-2 w-full rounded bg-white/20 dark:bg-gray-700" />
        </div>
      ) : error ? (
        <div className="rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      ) : (
        body
      )}
    </div>
  );
};

export default StatsCard;
