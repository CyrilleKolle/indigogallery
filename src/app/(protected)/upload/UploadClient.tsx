"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, LayoutGroup } from "framer-motion";
import { uploadImages } from "./actions";
import Image from "next/image";
import { usePreviews } from "@/store";
import { FormValues, schema } from "@/lib/upload-schema";
import { cn } from "@/utilities";
import {
  LabelComponent,
  PageWrapper,
  PreviewContainer,
  RemoveButton,
  SubmitSection,
  UploadForm,
} from "./UploadClientComponents";

const TODAY_YEAR = new Date().getFullYear().toString();

export default function UploadClient() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const files = watch("files") ?? null;
  const { previews, remove } = usePreviews(files);

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const removeSelectedFile = (id: string) => {
    const remaining = previews.filter((p) => p.id !== id).map((p) => p.file);
    setValue("files", remaining as unknown as FileList, {
      shouldValidate: true,
    });
    remove(id);
  };

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await uploadImages({
        year: Number(data.year),
        files: data.files,
      });
      if (res.ok) {
        setSuccessMsg("Upload complete!");
        reset();
      } else {
        setServerError(res.error ?? "Upload failed");
      }
    });
  });

  return (
    <PageWrapper className={cn(SECTION_BASE, SECTION_ADDITIONAL, COMMON_BASE)}>
      <UploadForm onSubmit={onSubmit}>
        <LabelComponent
          label="Year"
          inputRegister={register("year")}
          inputPlaceholder={TODAY_YEAR}
          errors={errors.year ? errors.year.message : null}
          inputClassName="w-full p-2 text-xl tracking-wide rounded-lg bg-gray-800 border border-sky-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-500 text-gray-300"
          inputType="text"
        />
        <LabelComponent
          label="Images"
          inputRegister={register("files")}
          inputType="file"
          inputPlaceholder="Select images"
          inputClassName={INPUT_BASE}
          errors={errors.files ? errors.files.message : null}
          inputProps={{ multiple: true, accept: "image/*" }}
        />
        {!!previews.length && (
          <LayoutGroup>
            <motion.div className={GALLERY_GRID} layout>
              {previews.map((p) => (
                <PreviewContainer key={`Preview-${p.id}`}>
                  <Image
                    src={p.url}
                    alt={p.file.name}
                    className="object-cover w-full h-full object-cover pointer-events-none"
                    width={64}
                    height={64}
                    key={p.id}
                    sizes="(max-width: 640px) 20vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 15vw"
                  />
                  <RemoveButton
                    key={`Remove-${p.id}`}
                    onClick={() => removeSelectedFile(p.id)}
                  />
                </PreviewContainer>
              ))}
            </motion.div>
          </LayoutGroup>
        )}
        <SubmitSection
          valid={!isValid}
          isPending={isPending}
          serverError={serverError}
          successMsg={successMsg}
        />
      </UploadForm>
    </PageWrapper>
  );
}

const SECTION_BASE = cn(
  "py-6 px-3 md:py-8 md:px-8 gap-2 md:gap-8",
  "z-50 fixed inset-0 pointer-events-auto",
  "place-content-center justify-stretch"
);
const SECTION_ADDITIONAL = cn(
  "max-w-[90vw] lg:max-w-4xl xl:max-w-6xl",
  "p-3 md:p-4 rounded-xl opacity-95 overflow-visible"
);
const GALLERY_GRID = cn(
  "grid grid-flow-col auto-cols-[minmax(theme(width.16),1fr)]",
  "sm:grid-flow-row sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  "gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5",
  "overflow-x-auto overflow-y-hidden",
  "sm:overflow-x-hidden sm:overflow-y-auto sm:max-h-80",
  "w-full transition-opacity duration-200 scrollbar-thin scrollbar-thumb-gray-700"
);
const COMMON_BASE = cn(
  "flex flex-col items-center h-fit my-auto overflow-y-auto",
  "w-full mx-auto bg-gray-900/90 shadow-lg shadow-cyan-50/5",
  "transition-opacity duration-200"
);

const INPUT_BASE = cn(
  "block w-full text-lg tracking-wider text-gray-300",
  "file:mr-4 file:py-2 file:px-4",
  "file:rounded-lg file:border-0",
  "file:text-base md:file:text-xl file:font-semibold",
  "file:bg-sky-900 file:text-gray-300",
  "file:transition-colors file:duration-200",
  "hover:file:bg-cyan-400 hover:file:text-indigo-900"
);
