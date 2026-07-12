import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://app:app@localhost:5432/petapp?schema=public",
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.favorite.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log("Datos existentes eliminados.");

  // ── USUARIOS ──────────────────────────────────────
  console.log("Creando usuarios...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Maria García",
        email: "maria@rescatepatas.org",
        emailVerified: true,
        contact: "+5491123456789",
        contactType: "WhatsApp",
        profilePictureUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos López",
        email: "carlos@adoptaya.com",
        emailVerified: true,
        contact: "+5491122334455",
        contactType: "WhatsApp",
        profilePictureUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Laura Benítez",
        email: "laura@huellitasfelices.org",
        emailVerified: true,
        contact: "@laura_refugio",
        contactType: "Instagram",
        profilePictureUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Martín Suárez",
        email: "martin@mascoteros.org",
        emailVerified: true,
        contact: "martin_rescatista",
        contactType: "Telegram",
        profilePictureUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofía Romero",
        email: "sofia@adoptapp.org",
        emailVerified: true,
        contact: "Sofía Romero#1234",
        contactType: "Discord",
        profilePictureUrl: "https://randomuser.me/api/portraits/women/17.jpg",
      },
    }),
  ]);

  console.log(`${users.length} usuarios creados.`);

  // ── POSTS ─────────────────────────────────────────
  console.log("Creando publicaciones...");

  const posts = await Promise.all([
    // ── Perros ──
    prisma.post.create({
      data: {
        userId: users[0].id,
        name: "Rocky",
        age: 3,
        weight: 25.5,
        size: "large",
        category: "dog",
        gender: "male",
        neutered: true,
        latitude: -34.6037,
        longitude: -58.3816,
        location: "Palermo, CABA",
        placeId: "ChIJW_rnPJvKvJURtHCFyA8PsrY",
        birthDate: new Date("2023-03-15"),
        description:
          "Rocky es un labrador mestizo súper cariñoso. Le encanta jugar con la pelota y se lleva bien con otros perros y niños. Está castrado y con todas las vacunas al día.",
        photosUrl: [
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
          "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[0].id,
        name: "Luna",
        age: 1,
        weight: 8.2,
        size: "small",
        category: "dog",
        gender: "female",
        neutered: false,
        latitude: -34.6118,
        longitude: -58.4173,
        location: "Caballito, CABA",
        birthDate: new Date("2025-01-10"),
        description:
          "Luna es una cachorrita caniche de solo 1 año. Es muy juguetona y activa. Ideal para departamento. Se entrega con compromiso de castración.",
        photosUrl: [
          "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600",
          "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[0].id,
        name: "Toby",
        age: 5,
        weight: 15.0,
        size: "medium",
        category: "dog",
        gender: "male",
        neutered: true,
        latitude: -34.6073,
        longitude: -58.3912,
        location: "Recoleta, CABA",
        birthDate: new Date("2021-05-20"),
        description:
          "Toby es un mestizo de tamaño mediano, muy tranquilo y compañero. Ideal para personas mayores. Está acostumbrado a vivir en departamento.",
        photosUrl: [
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600",
          "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[1].id,
        name: "Max",
        age: 2,
        weight: 30.0,
        size: "large",
        category: "dog",
        gender: "male",
        neutered: false,
        latitude: -34.5980,
        longitude: -58.4200,
        location: "Villa Crespo, CABA",
        birthDate: new Date("2024-02-14"),
        description:
          "Max es un ovejero belga muy inteligente y enérgico. Necesita espacio y dueños con experiencia en razas de trabajo. Está entrenado en obediencia básica.",
        photosUrl: [
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600",
          "https://images.unsplash.com/photo-1578169461819-da25819b939a?w=600",
          "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[1].id,
        name: "Bella",
        age: 4,
        weight: 7.0,
        size: "small",
        category: "dog",
        gender: "female",
        neutered: true,
        latitude: -34.5650,
        longitude: -58.5100,
        location: "Vicente López, GBA Norte",
        birthDate: new Date("2022-08-10"),
        description:
          "Bella es una pequeña salchicha muy mimosa. Le encanta dormir en el sillón y pasear con correa. Se lleva genial con gatos.",
        photosUrl: [
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[2].id,
        name: "Thor",
        age: 2,
        weight: 28.0,
        size: "large",
        category: "dog",
        gender: "male",
        neutered: true,
        latitude: -34.6170,
        longitude: -58.3670,
        location: "San Telmo, CABA",
        birthDate: new Date("2024-06-01"),
        description:
          "Thor es un dóberman rescatado. Es muy leal y protector, pero necesita socialización. Ya está castrado y vacunado. Busca un dueño con patio.",
        photosUrl: [
          "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600",
        ],
      },
    }),
    // ── Gatos ──
    prisma.post.create({
      data: {
        userId: users[1].id,
        name: "Michi",
        age: 2,
        weight: 4.5,
        size: "small",
        category: "cat",
        gender: "female",
        neutered: true,
        latitude: -34.6160,
        longitude: -58.4400,
        location: "Flores, CABA",
        birthDate: new Date("2024-04-12"),
        description:
          "Michi es una gatita atigrada muy independiente pero cariñosa a su manera. Está castrada y usa las piedritas. Ideal para depto.",
        photosUrl: [
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
          "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[2].id,
        name: "Simba",
        age: 1,
        weight: 5.0,
        size: "small",
        category: "cat",
        gender: "male",
        neutered: false,
        latitude: -34.5880,
        longitude: -58.3970,
        location: "Palermo Hollywood, CABA",
        birthDate: new Date("2025-03-01"),
        description:
          "Simba es un gatito naranja de 1 año, súper juguetón y mimoso. Apareció en la puerta del refugio. Se entrega con compromiso de castración.",
        photosUrl: [
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[2].id,
        name: "Lola",
        age: 3,
        weight: 3.8,
        size: "small",
        category: "cat",
        gender: "female",
        neutered: true,
        latitude: -34.6140,
        longitude: -58.5100,
        location: "Villa Devoto, CABA",
        birthDate: new Date("2023-11-08"),
        description:
          "Lola es una gata siamesa muy conversadora. Le encanta maullar y seguirte a todos lados. Está castrada y con todas las vacunas.",
        photosUrl: [
          "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[3].id,
        name: "Garfield",
        age: 6,
        weight: 7.2,
        size: "medium",
        category: "cat",
        gender: "male",
        neutered: true,
        latitude: -34.6100,
        longitude: -58.3800,
        location: "Monserrat, CABA",
        birthDate: new Date("2020-01-30"),
        description:
          "Garfield es un gato naranja gordito y perezoso, tal como su nombre lo indica. Le encanta dormir y comer. Busca un hogar tranquilo.",
        photosUrl: [
          "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600",
        ],
      },
    }),
    // ── Otros ──
    prisma.post.create({
      data: {
        userId: users[3].id,
        name: "Manchitas",
        age: 2,
        weight: 1.8,
        size: "small",
        category: "other",
        gender: "female",
        neutered: false,
        latitude: -34.6050,
        longitude: -58.4000,
        location: "Almagro, CABA",
        birthDate: new Date("2024-07-22"),
        description:
          "Manchitas es una conejita enana muy dócil. Le encanta que le den zanahoria y hacer túneles. Se entrega con jaula incluida. No apta para casas con perros.",
        photosUrl: [
          "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[3].id,
        name: "Paco",
        age: 3,
        weight: 12.0,
        size: "medium",
        category: "other",
        gender: "male",
        neutered: true,
        latitude: -34.5700,
        longitude: -58.4500,
        location: "Belgrano, CABA",
        birthDate: new Date("2023-09-05"),
        description:
          "Paco es un loro hablador muy divertido. Sabe decir varias palabras y silbar canciones. Necesita una jaula grande y dueños con experiencia en aves.",
        photosUrl: [
          "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[4].id,
        name: "Rocco",
        age: 4,
        weight: 22.0,
        size: "large",
        category: "dog",
        gender: "male",
        neutered: true,
        latitude: -32.8895,
        longitude: -68.8458,
        location: "Ciudad de Mendoza, Mendoza",
        birthDate: new Date("2022-12-01"),
        description:
          "Rocco es un golden retriever puro, muy bueno y familiero. Fue rescatado de una situación de maltrato pero ya está recuperado. Ideal para familia con chicos.",
        photosUrl: [
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600",
          "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[4].id,
        name: "Nala",
        age: 1,
        weight: 4.2,
        size: "small",
        category: "cat",
        gender: "female",
        neutered: true,
        latitude: -31.4201,
        longitude: -64.1888,
        location: "Centro, Córdoba Capital",
        birthDate: new Date("2025-02-20"),
        description:
          "Nala es una gatita tricolor rescatada de la calle. Es muy agradecida y ronronea todo el tiempo. Ya está castrada y desparasitada.",
        photosUrl: [
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600",
        ],
      },
    }),
    prisma.post.create({
      data: {
        userId: users[4].id,
        name: "Coco",
        age: 7,
        weight: 10.0,
        size: "small",
        category: "dog",
        gender: "male",
        neutered: true,
        latitude: -32.9476,
        longitude: -60.6326,
        location: "Centro, Rosario, Santa Fe",
        birthDate: new Date("2019-10-15"),
        description:
          "Coco es un perrito senior muy tranquilo. Solo quiere una cama calentita y paseos cortos. Es ideal para alguien que busque compañía sin mucho movimiento.",
        photosUrl: [
          "https://images.unsplash.com/photo-1581888227599-779811939961?w=600",
        ],
      },
    }),
  ]);

  console.log(`${posts.length} publicaciones creadas.`);

  // ── FAVORITOS ─────────────────────────────────────
  console.log("Creando favoritos...");

  const favorites = await Promise.all([
    prisma.favorite.create({
      data: { userId: users[1].id, postId: posts[0].id },
    }),
    prisma.favorite.create({
      data: { userId: users[2].id, postId: posts[0].id },
    }),
    prisma.favorite.create({
      data: { userId: users[3].id, postId: posts[1].id },
    }),
    prisma.favorite.create({
      data: { userId: users[4].id, postId: posts[1].id },
    }),
    prisma.favorite.create({
      data: { userId: users[0].id, postId: posts[6].id },
    }),
    prisma.favorite.create({
      data: { userId: users[1].id, postId: posts[6].id },
    }),
    prisma.favorite.create({
      data: { userId: users[2].id, postId: posts[9].id },
    }),
    prisma.favorite.create({
      data: { userId: users[0].id, postId: posts[12].id },
    }),
    prisma.favorite.create({
      data: { userId: users[3].id, postId: posts[13].id },
    }),
    prisma.favorite.create({
      data: { userId: users[4].id, postId: posts[14].id },
    }),
  ]);

  console.log(`${favorites.length} favoritos creados.`);

  // ── SESSIONS (para poder hacer login sin pasar por auth) ──
  console.log("Creando sesiones de prueba...");

  const sessions = await Promise.all(
    users.map((user) =>
      prisma.session.create({
        data: {
          userId: user.id,
          token: `seed-token-${user.id}`,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 días
          ipAddress: "127.0.0.1",
          userAgent: "SeedScript/1.0",
        },
      })
    )
  );

  console.log(`${sessions.length} sesiones creadas.`);

  // ── RESUMEN ───────────────────────────────────────
  console.log("\n=== RESUMEN ===");
  console.log(`Usuarios:     ${users.length}`);
  console.log(`Posts:        ${posts.length}`);
  console.log(`Favoritos:    ${favorites.length}`);
  console.log(`Sesiones:     ${sessions.length}`);
  console.log("Datos de prueba inyectados exitosamente.");

  // Mostrar IDs de usuarios para referencia
  for (const user of users) {
    console.log(`  ${user.name} → token: seed-token-${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error("Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
