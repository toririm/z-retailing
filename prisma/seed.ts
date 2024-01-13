import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.item.createMany({
    data: [
      { name: "コカ・コーラ", price: 140 },
      { name: "炭酸水", price: 100 },
      { name: "MAXCOFFEE", price: 90 },
      { name: "カップスープの素", price: 60 },
      { name: "ガラナ500ml", price: 140 },
      { name: "ウーロン茶", price: 80 },
      { name: "三ツ矢サイダー", price: 110 },
      { name: "水", price: 70 },
    ],
    skipDuplicates: true,
  });
  console.log({ items });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
