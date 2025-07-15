"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { writeFile }      from "node:fs/promises";
import path               from "node:path";

const schema = z.object({
  year: z.number(),
  files: z.custom<FileList>(),
});

type Result =
  | { ok: true }
  | { ok: false; error?: string };

export async function uploadImages(data: {
  year: number;
  files: FileList;
}): Promise<Result> {
  /* 1 ▸ validate again on the server (never trust the client) */
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Invalid payload" };
  }

  /* 2 ▸     --- write files ---
     NOTE: in real life you’d stream directly to S3, R2, Cloudinary, etc.
           Below is a local example for /public/uploads */
  try {
    const destDir = path.join(process.cwd(), "public", "uploads", `${data.year}`);
    await writeFile(destDir, ""); // ensure dir exists – simplified

    await Promise.all(
      Array.from(data.files).map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer      = Buffer.from(arrayBuffer);
        const destPath    = path.join(destDir, file.name);
        await writeFile(destPath, buffer);
      })
    );

    revalidatePath(`/year/${data.year}`);          // invalidate gallery ISR
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to save files" };
  }
}