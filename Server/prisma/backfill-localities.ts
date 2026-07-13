// ─────────────────────────────────────────────────────
//  Backfill — Normaliza la localidad (Georef) de los
//  posts existentes a partir de sus coordenadas y placeId.
//
//  Uso:  npm run backfill:localities
//  Es idempotente: solo procesa posts sin provinceId.
// ─────────────────────────────────────────────────────

import "dotenv/config";
import prisma from "../src/config/database";
import { locationService } from "../src/features/locations/service/location.service";

const GEOREF_DELAY_MS = 150; // rate limit amistoso con Georef

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ provinceId: null }, { municipalityId: null }],
    },
    select: { id: true, latitude: true, longitude: true, placeId: true, location: true },
  });

  console.log(`Posts a normalizar: ${posts.length}`);
  let updated = 0;
  let failed = 0;

  for (const post of posts) {
    const area = await locationService.normalizeArea(
      post.latitude,
      post.longitude,
      post.placeId,
    );

    if (area) {
      await prisma.post.update({
        where: { id: post.id },
        data: { ...area },
      });
      updated += 1;
      console.log(
        `✔ ${post.id} → ${area.localityName ?? area.municipalityName ?? area.departmentName ?? "?"}, ${area.provinceName ?? "?"}`,
      );
    } else {
      failed += 1;
      console.warn(`✖ ${post.id} (${post.location}) — Georef no devolvió datos`);
    }

    await sleep(GEOREF_DELAY_MS);
  }

  console.log(`Listo. Actualizados: ${updated} — Sin datos: ${failed}`);
}

main()
  .catch((error) => {
    console.error("Backfill error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
