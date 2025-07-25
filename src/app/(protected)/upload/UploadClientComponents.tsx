"use client";

import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLElement | null>;
  id?: string;
}
export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ children, className, id }, ref) => {
    return (
      <motion.section
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{
          duration: 0.5,
          ease: [0.5, 0.62, 0.62, 0.5],
          type: "tween",
        }}
        ref={ref}
        id={id}
      >
        {children}
      </motion.section>
    );
  }
);

interface UploadFormProps {
  onSubmit: () => void;
  children?: React.ReactNode;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  onSubmit,
  children = null,
}) => {
  return (
    <form
      autoComplete="off"
      method="post"
      name="upload-form"
      target="_self"
      className="flex flex-col items-center gap-8 w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export interface LabelComponentProps {
  label: string;
  labelClassName?: string;
  errors: string | null | undefined;
  inputRegister: any;
  inputPlaceholder: string;
  inputType: string;
  inputClassName: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const LabelComponent: React.FC<LabelComponentProps> = ({
  label,
  labelClassName = "block mb-1 font-medium text-lg md:text-2xl tracking-wide text-gray-300",
  errors,
  inputRegister,
  inputPlaceholder = "",
  inputType = "text",
  inputClassName = "w-full p-2 text-base md:text-xl tracking-wide rounded-lg bg-gray-800 border border-sky-700 focus:outline-none focus:ring-2 focus:ring-cyan-400",
  inputProps,
}) => {
  return (
    <label className="w-full">
      <span className={labelClassName}>{label}</span>
      <input
        type={inputType}
        placeholder={inputPlaceholder}
        {...inputRegister}
        className={inputClassName}
        {...inputProps}
      />
      {errors && (
        <p className="text-rose-900 text-md tracking-wide mt-1">{errors}</p>
      )}
    </label>
  );
};

export interface RemoveButtonProps {
  onClick: () => void;
  className?: string;
}
export const RemoveButton: React.FC<RemoveButtonProps> = ({
  onClick,
  className = "absolute bottom-1 md:bottom-2 right-1 md:bottom-2 bg-sky-900 text-gray-300 rounded-full p-1 hover:bg-cyan-400 transition-colors text-gray-300 hover:text-indigo-900",
}) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="sr-only">Remove</span>
      <XMarkIcon className="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" />
    </button>
  );
};

export const PreviewContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      className="relative aspect-square overflow-hidden rounded-lg"
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

interface SubmitSectionProps {
  valid?: boolean;
  isPending?: boolean;
  serverError?: string | null;
  successMsg?: string | null;
  onClick?: () => void;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  valid = false,
  isPending = false,
  serverError = null,
  successMsg = null,
  onClick = () => {},
}) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        type="submit"
        onClick={onClick}
        disabled={valid || isPending}
        className="px-4 md:px-6 py-3 rounded-lg bg-sky-700 hover:bg-cyan-400 disabled:bg-gray-700 hover:text-indigo-700 disabled:cursor-not-allowed hover:disabled:text-gray-400 disabled:text-gray-500
                     transition-colors font-semibold tracking-wide"
      >
        {isPending ? "Uploading…" : "Upload"}
      </button>
      {serverError && (
        <p className="text-rose-900 mt-2 tracking-wide text-lg">
          {serverError}
        </p>
      )}
      {successMsg && (
        <p className="text-emerald-900 mt-2 tracking-wide text-lg">
          {successMsg}
        </p>
      )}
    </div>
  );
};
