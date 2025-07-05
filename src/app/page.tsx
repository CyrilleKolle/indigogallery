import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("preAuth")?.value;
  if (!jwt) redirect("/login");
  redirect("/");
}
