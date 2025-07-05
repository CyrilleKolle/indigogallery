"dotenv/config";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { db, buildSearchIndex } from "@/lib";

console.log("ENV seen by script:", process.env.FB_PROJECT_ID);
console.log("ENV seen by script:", process.env.FB_CLIENT_EMAIL);
console.log(
  "ENV seen by script:",
  process.env.FB_PRIVATE_KEY?.substring(0, 20) + "..."
);

// This script seeds initial members into the Firestore database.
// It can be run with the command:
// `npx tsx -r dotenv/config scripts/seedMembers.ts`
// npx tsx -r dotenv/config scripts/seedMembers.ts
const members = [
  {
    id: "kolle",
    displayName: "Kolle",
    email: "nkolle@yahoo.com",
    searchIndex: ["k", "ko", "kol", "koll", "kolle"],
    lastOtpSentAt: 0,
    otpHash: "",
    otpExpires: 0,
  },
  {
    id: "ida",
    displayName: "Ida",
    email: "nkolle@yahoo.com",
    searchIndex: ["i", "id", "ida"],
    lastOtpSentAt: 0,
    otpHash: "",
    otpExpires: 0,
  },
];

async function main() {
  for (const m of members) {
    await db
      .collection("members")
      .doc(m.id)
      .set({
        displayName: m.displayName,
        email: m.email,
        searchIndex: buildSearchIndex(m.displayName),
        lastOtpSentAt: 0,
        otpHash: "",
        otpExpires: 0,
      });
    console.log(`Seeded ${m.id}`);
  }
  process.exit(0);
}
main();
