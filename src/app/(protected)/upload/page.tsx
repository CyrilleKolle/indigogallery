import { Metadata } from "next";
import UploadClient from "./UploadClient";

export const metadata: Metadata = { title: "Upload images" };

export default function UploadPage() {
  return <UploadClient />;
}
