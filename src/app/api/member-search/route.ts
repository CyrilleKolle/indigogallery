import { NextRequest, NextResponse } from "next/server";
import { verifyPreAuth } from "@/lib/auth";
import { db } from "@/lib/server";

export async function GET(req: NextRequest) {
  await verifyPreAuth();

  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const snapshot = await db
    .collection("members")
    .where("searchIndex", "array-contains", q)
    .limit(5)
    .get();

  const members = snapshot.docs.map((d) => ({
    id: d.id,
    displayName: d.data().displayName,
  }));
  return NextResponse.json(members);
}
