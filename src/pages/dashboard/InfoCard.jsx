import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * InfoCard – enhanced
 *
 * Backwards compatible props:
 *  - icon: Icon component
 *  - title: string
 *  - content: string | ReactNode
 *  - linkLabel: string
 *  - linkTo: string
 *
 * New optional props:
 *  - subtitle?: string
 *  - description?: string
 *  - stats?: Array<{ label: string, value: React.ReactNode }>
 *  - meta?: Array<{ label: string, value: React.ReactNode }>
 *  - badge?: { text: string, tone?: "green"|"blue"|"yellow"|"red"|"gray" }
 *  - updatedAt?: string | Date
 *  - footer?: React.ReactNode
 *  - loading?: boolean
 *  - error?: string
 *  - children?: React.ReactNode
 *  - collapsibleLength?: number  // default 160 chars
 */

const toneClasses = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  gray: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function formatRelativeTime(dateLike) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (isNaN(d)) return null;
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const minutes = Math.round(abs / (60 * 1000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  content,
  linkLabel,
  linkTo,

  // new
  subtitle,
  description,
  stats,
  meta,
  badge,
  updatedAt,
  footer,
  loading = false,
  error = "",
  children,
  collapsibleLength = 160,
}) => {
  const [expanded, setExpanded] = useState(false);

  const relative = useMemo(() => formatRelativeTime(updatedAt), [updatedAt]);

  const showToggle =
    typeof description === "string" && description.length > collapsibleLength;

  const clippedDescription =
    !expanded && showToggle
      ? description.slice(0, collapsibleLength) + "…"
      : description;

  return (
    <div
      className="bg-white shadow-lg dark:bg-gray-800 rounded-lg p-4 transition-all dark:hover:shadow-gray-500"
      role="region"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className="h-5 w-5 text-gray-500 dark:text-gray-300"
              aria-hidden="true"
            />
          )}
          <div>
            <h3 className="text-md text-gray-800 dark:text-gray-100 font-medium">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            ) : null}
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

        {linkLabel && linkTo ? (
          <Link
            to={linkTo}
            className="text-md underline text-blue-600 hover:underline dark:text-blue-400"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>

      {/* Loading / Error / Content */}
      <div className="mt-4">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        ) : (
          <>
            {/* Main content (backwards compatible) */}
            {content ? (
              <div className="text-gray-700 dark:text-gray-200 text-md">
                {content}
              </div>
            ) : null}

            {/* Long description with toggle */}
            {description ? (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {clippedDescription}
                </p>
                {showToggle ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => !s)}
                    className="mt-1 text-xs underline text-blue-600 dark:text-blue-400"
                    aria-expanded={expanded}
                  >
                    {expanded ? "Show less" : "Show more"}
                  </button>
                ) : null}
              </div>
            ) : null}

            {/* Stats row */}
            {Array.isArray(stats) && stats.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {s.label}
                    </div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Meta list */}
            {Array.isArray(meta) && meta.length > 0 ? (
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {meta.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <dt className="text-xs text-gray-500 dark:text-gray-400 min-w-24">
                      {m.label}
                    </dt>
                    <dd className="text-sm text-gray-800 dark:text-gray-100">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Custom slot */}
            {children ? <div className="mt-4">{children}</div> : null}

            {/* Footer & last updated */}
            <div className="mt-4 flex items-center justify-between">
              {footer ? <div className="text-sm">{footer}</div> : <span />}
              {relative ? (
                <div
                  className="text-xs text-gray-500 dark:text-gray-400"
                  title={new Date(updatedAt).toLocaleString()}
                >
                  Last updated {relative}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
