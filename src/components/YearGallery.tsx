"use client";

import Image from "next/image";
import { useGlobeStore } from "@/store/useGlobeStore";
import { useRouter } from "next/navigation";

type Props = { year: string; files: string[] };

export function YearGallery({ year, files }: Props) {
  const router = useRouter();

  const reset = useGlobeStore((s) => s.reset);
  const handleClose = () => {
    reset(() => router.push("/")); // or router.back();
  };
  return (
    <section
      className="
    [@keyframes_fadeInUp{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}]
    [animation:fadeInUp_0.5s_ease-out_forwards]
    py-8 px-4 md:px-8 flex flex-col items-center gap-8"
    >
      <div className="flex flex-row items-center justify-center gap-6 w-full max-w-3xl">
        <h1 className="group flex flex-row gap-2 text-lg text-white md:text-2xl tracking-wide text-center select-none transition-colors duration-150 hover:text-indigo-300">
          <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
            [
          </span>

          <span className="transform inline-block transition-transform duration-200 group-hover:scale-90">
            Year {year}
          </span>

          <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
            ]
          </span>
        </h1>

        <button
          className="group inline-flex items-center gap-2 text-lg text-white md:text-2xl tracking-wide uppercase transition-colors duration-150 hover:text-indigo-300"
          onClick={handleClose}
        >
          <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
            [
          </span>
          <span className="transform inline-block transition-transform duration-200 group-hover:scale-90">
            close
          </span>
          <span className="transform inline-block origin-center transition-transform duration-200 group-hover:scale-125">
            ]
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full max-w-6xl bg-gray-900 p-4 rounded-lg shadow-lg opacity-90 hover:opacity-90 transition-opacity duration-200">
        {files.map((f) => (
          <Image
            key={f}
            src={`/years/${year}/${f}`}
            alt={f}
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
            className="rounded-lg shadow-lg transition-transform duration-200 hover:scale-115 hover:shadow-xl"
          />
        ))}
      </div>
    </section>
  );
}
