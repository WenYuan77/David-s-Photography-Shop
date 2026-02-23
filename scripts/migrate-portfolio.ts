/**
 * Migration script: Upload existing portfolio images from public/portfolio_pictures
 * to Supabase Storage and insert metadata into portfolio_images table.
 *
 * Run with: npx tsx scripts/migrate-portfolio.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });
config();
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BUCKET = "portfolio";

const categories = [
  { id: "Wedding", files: ["W2.jpeg", "W5.jpeg", "W6.jpeg", "W7.jpeg", "W10.jpeg", "W14.jpeg", "W15.jpeg", "W17.jpeg", "W18.jpeg", "W19.jpeg", "W22.jpeg", "W23.jpeg"] },
  { id: "Engagement", files: ["Couple1.jpeg", "Couple3.jpeg", "Couple6.jpeg", "Couple7.jpeg", "Couple8.jpeg", "Couple9.PNG", "Couple10.jpeg", "Couple12.PNG", "Couple13.PNG", "Couple13.jpeg"] },
  { id: "Family-Children", files: ["F3.PNG", "F5.jpeg", "K1 (1).jpg", "K2.jpg", "K4.PNG", "K5.PNG", "K6.PNG", "K7.jpeg", "K8.PNG", "K9.PNG", "K12.PNG", "K13.jpeg", "K16.jpeg"] },
  { id: "Portrait", files: ["H3.jpeg", "H6.png", "H9.jpeg", "P1.jpg", "P3.jpg", "P10.jpg", "P11.PNG", "P12.JPG", "P16.jpeg", "P17.jpeg", "P18.jpeg", "P19.jpeg", "P20.jpeg", "P22.PNG", "P23.PNG", "P24.PNG", "P25.jpeg", "P28.JPG", "P30.JPG", "P33 (1).jpeg", "P33.jpeg", "P34.jpeg", "P37.jpeg", "P38.jpeg", "P39.jpeg", "P40.jpeg"] },
  { id: "Pets", files: ["Pet1.PNG", "Pet2.PNG", "Pet3.jpeg", "Pet4.PNG", "Thor.PNG", "Thor2.jpeg", "Thor3.jpg", "Thor4.jpg", "Thor5.jpeg"] },
  { id: "Automotive", files: ["Car1.JPG", "Car2.jpeg", "Car4.jpeg", "Car5.jpeg"] },
  { id: "Events", files: ["E2.PNG", "E3.JPG", "E4.jpg", "E5.jpeg", "G2.jpeg"] },
];

const altByCategory: Record<string, string> = {
  Wedding: "Wedding photography",
  Engagement: "Engagement photography",
  "Family-Children": "Family & children photography",
  Portrait: "Portrait photography",
  Pets: "Pet photography",
  Automotive: "Automotive photography",
  Events: "Event photography",
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const publicDir = join(process.cwd(), "public", "portfolio_pictures");
  if (!existsSync(publicDir)) {
    console.error("public/portfolio_pictures not found. Run from project root.");
    process.exit(1);
  }

  for (const cat of categories) {
    for (let i = 0; i < cat.files.length; i++) {
      const filename = cat.files[i];
      const filePath = join(publicDir, cat.id, filename);
      if (!existsSync(filePath)) {
        console.warn(`Skip (not found): ${cat.id}/${filename}`);
        continue;
      }

      const buffer = readFileSync(filePath);
      const ext = filename.split(".").pop() || "jpg";
      const baseName = filename.replace(/\.[^/.]+$/, "").replace(/\s/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
      const stamp = `${Date.now()}-${i}`;
      const storagePath = `${cat.id}/${baseName}-${stamp}.${ext}`;
      const imageId = `migrated-${cat.id}-${baseName}-${stamp}`;

      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
        contentType: `image/${ext === "jpg" || ext === "jpeg" ? "jpeg" : ext === "png" ? "png" : "jpeg"}`,
        upsert: false,
      });

      if (uploadErr) {
        console.error(`Upload failed ${cat.id}/${filename}:`, uploadErr.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      const { error: insertErr } = await supabase.from("portfolio_images").insert({
        id: imageId,
        category_id: cat.id,
        src: urlData.publicUrl,
        alt: altByCategory[cat.id] || `${cat.id} photography`,
        sort_order: i,
      });

      if (insertErr) {
        console.error(`Insert failed ${cat.id}/${filename}:`, insertErr.message);
        await supabase.storage.from(BUCKET).remove([storagePath]);
        continue;
      }

      console.log(`Migrated: ${cat.id}/${filename}`);
    }
  }

  console.log("Migration complete.");
}

main().catch(console.error);
