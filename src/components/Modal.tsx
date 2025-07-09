"use client";

import React, { JSX } from "react";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";

const OVERLAY_CLASSES =
  "fixed inset-0 z-50 flex items-center justify-center pointer-events-auto";

const CONTAINER_BASE =
  "w-80 space-y-4 bg-white p-8 rounded shadow hover:shadow-lg transition-shadow duration-200";

/**
 * Centers its children in a fullscreen overlay.
 */
export function ModalOverlay({ children }: { children: React.ReactNode }) {
  return <main className={OVERLAY_CLASSES}>{children}</main>;
}

/**
 * Polymorphic container for intrinsic elements 'div' or 'form'.
 * Renders as `div` by default or any other tag via the `as` prop.
 */
export type ModalContainerProps<C extends keyof JSX.IntrinsicElements = "div"> =
  {
    /**
     * Tag to render, e.g. "form" or "div".
     */
    as?: C;
    className?: string;
    children?: React.ReactNode;
  } & Omit<JSX.IntrinsicElements[C], "className" | "children">;

export function ModalContainer<C extends keyof JSX.IntrinsicElements = "div">({
  as,
  className = "",
  children,
  ...rest
}: ModalContainerProps<C>) {
  const Tag = as || ("div" as C);
  const MotionTag = (motion as any)[Tag] || motion.div;
  return (
    <MotionTag
      layout
      transition={{
        layout: { duration: 0.25, ease: cubicBezier(0.5, 0.62, 0.62, 0.5) },
      }}
      className={`${CONTAINER_BASE} ${className}`}
      {...(rest as any)}
    >
      {children}
    </MotionTag>
  );
}

/** Modal title (h1) */
export function ModalTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-2xl text-center text-indigo-900 tracking-wide ${className}`}
    >
      {children}
    </h1>
  );
}

/** Modal error text (p) */
export function ModalError({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.p
        key={children?.toString()}
        layout
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: 0.4,
          ease: cubicBezier(0.5, 0.62, 0.62, 0.5),
        }}
        className={`text-md tracking-wide text-red-600 place-self-center ${className}`}
      >
        {children}
      </motion.p>
    </AnimatePresence>
  );
}

/** Modal input */
export function ModalInput(props: JSX.IntrinsicElements["input"]) {
  return (
    <input
      {...props}
      className={
        `w-full border px-3 py-2 rounded border-indigo-100 focus:border-linear-to-r from-cyan-500 to-indigo-500 transition-colors duration-200 text-indigo-900 text-lg ` +
        (props.className ?? "")
      }
    />
  );
}

/** Modal button */
export function ModalButton({
  children,
  className = "",
  ...rest
}: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...rest}
      className={
        `w-full tracking-wide text-lg py-2 bg-indigo-900 text-white rounded disabled:opacity-50 hover:bg-linear-to-r from-cyan-500 to-indigo-500 transition-colors duration-200 ` +
        className
      }
    >
      {children}
    </button>
  );
}

/** Modal list container (ul) */
export function ModalList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ul className={`space-y-2 ${className}`}>{children}</ul>;
}

/** Modal list item (li) */
export function ModalListItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={className}>{children}</li>;
}

/** Modal list button for pickable items */
export function ModalListButton(props: JSX.IntrinsicElements["button"]) {
  const { children, className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        `w-full border px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-150 ` +
        className
      }
    >
      {children}
    </button>
  );
}

/**
 * Renders a list of selectable items.
 *
 * @template T - item type
 * @param items - array of items
 * @param getKey - extracts a unique key from an item
 * @param getLabel - renders display label for an item
 * @param onSelect - callback when an item is clicked
 * @param loading - disable buttons when loading
 * @param className - additional classes for the UL
 */
export type ModalPickListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  loading?: boolean;
  className?: string;
  placeholderText?: string;
  searchingText?: string;
  noResultsText?: string;
  isSearching?: boolean;
  hasQuery?: boolean;
};

export function ModalPickList<T>({
  items,
  getKey,
  getLabel,
  onSelect,
  loading = false,
  className = "",
  placeholderText = "Enter your secret name",
  isSearching = false,
  searchingText = "Scanning…",
  noResultsText = "No user found",
  hasQuery = false,
}: ModalPickListProps<T>) {
  let state: "results" | "placeholder" | "searching" | "no-results";
  if (items.length > 0) state = "results";
  else if (!hasQuery) state = "placeholder";
  else if (isSearching) state = "searching";
  else state = "no-results";

  return (
    <motion.ul
      className={`space-y-2 ${className}`}
      layout
      transition={{
        layout: { duration: 0.4, ease: cubicBezier(0.5, 0.62, 0.62, 0.5) },
      }}
      role="list"
      aria-label="Pick a user"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "placeholder" && (
          <motion.li
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <ModalButton disabled>{placeholderText}</ModalButton>
          </motion.li>
        )}

        {state === "searching" && (
          <motion.li
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <ModalButton disabled>{searchingText}</ModalButton>
          </motion.li>
        )}
        {state === "no-results" && (
          <motion.li
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <ModalButton disabled>{noResultsText}</ModalButton>
          </motion.li>
        )}
        {state === "results" &&
          items.map((item) => (
            <motion.li
              key={getKey(item)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              layout
            >
              <ModalButton onClick={() => onSelect(item)} disabled={loading}>
                {loading
                  ? `Sending code to ${getLabel(item)}…`
                  : getLabel(item)}
              </ModalButton>
            </motion.li>
          ))}
      </AnimatePresence>
    </motion.ul>
  );
}
