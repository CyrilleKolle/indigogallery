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

const SECTION_BASE =
  "py-8 px-4 md:px-8 flex flex-col items-center gap-8 z-50 fixed inset-0 pointer-events-auto max-h-screen h-fit my-auto overflow-y-auto top-12";

const SECTION_ADDITIONAL =
  "w-full max-w-6xl mx-auto bg-gray-900/90 p-4 rounded-xl shadow-lg opacity-95 transition-opacity duration-200 overflow-visible shadow-cyan-50/5";
const GALLERY_GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full  transition-opacity duration-200";

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
    <PageWrapper className={cn(SECTION_BASE, SECTION_ADDITIONAL)}>
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
          inputClassName="block w-full text-lg tracking-wider text-gray-300 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-xl file:font-semibold
                       file:bg-sky-900 file:text-white
                       hover:file:bg-cyan-400 hover:file:text-indigo-900"
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
                    width={300}
                    height={300}
                    key={p.id}
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
