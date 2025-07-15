import { useEffect, useState } from "react";

export type Preview = { id: string; file: File; url: string };

/**
 * Custom hook to generate previews for a FileList.
 * Converts each file into a Preview object with a unique ID and URL.
 *
 * @param files - The FileList to generate previews for.
 * @returns An array of Preview objects.
 */
export function usePreviews(files: FileList | null) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  useEffect(() => {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [files]);

  const remove = (id: string) =>
    setPreviews((prev) => prev.filter((p) => p.id !== id));

  return { previews, remove };
}
