import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { YearGallery } from "@/app/(protected)/YearGallery";

export async function generateStaticParams() {
  const yearsDir = path.join(process.cwd(), "public", "years");
  const years = fs
    .readdirSync(yearsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ year: d.name }));
  return years;
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const dir = path.join(process.cwd(), "public", "years", year);
  try {
    await fs.promises.access(dir, fs.constants.R_OK);
  } catch {
    return notFound();
  }

  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));

  if (files.length === 0) return notFound();
  return <YearGallery year={year} files={files} />;
}
