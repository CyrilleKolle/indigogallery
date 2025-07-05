"use client";

import React, { JSX } from "react";

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
    /**
     * Additional Tailwind classes.
     */
    className?: string;
    /**
     * Content inside the container.
     */
    children?: React.ReactNode;
  } & Omit<JSX.IntrinsicElements[C], "className" | "children">;

export function ModalContainer<C extends keyof JSX.IntrinsicElements = "div">({
  as,
  className = "",
  children,
  ...rest
}: ModalContainerProps<C>) {
  const Tag = as || ("div" as C);
  return (
    <Tag className={`${CONTAINER_BASE} ${className}`} {...(rest as any)}>
      {children}
    </Tag>
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
    <p
      className={`text-md tracking-wide text-red-600 place-self-center ${className}`}
    >
      {children}
    </p>
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
};

export function ModalPickList<T>({
  items,
  getKey,
  getLabel,
  onSelect,
  loading = false,
  className = "",
}: ModalPickListProps<T>) {
  return (
    <ModalList className={className}>
      {items.map((item) => (
        <ModalListItem key={getKey(item)}>
          <ModalButton onClick={() => onSelect(item)} disabled={loading}>
            {getLabel(item)}
          </ModalButton>
        </ModalListItem>
      ))}
    </ModalList>
  );
}
