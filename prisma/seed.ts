import { randomUUID } from "node:crypto";
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
	const users = await prisma.user.createMany({
		data: [
			{
				name: "ほげふがたろう",
				authId: randomUUID(),
				email: "s1234567@u.tsukuba.ac.jp",
			},
			{
				name: "かっけー",
				authId: randomUUID(),
				email: "s9876543@u.tsukuba.ac.jp",
			},
			{
				name: "なす",
				authId: randomUUID(),
				email: "s9999999@u.tsukuba.ac.jp",
			},
			{
				name: "ほげふがじろう",
				authId: randomUUID(),
				email: "s385931@u.tsukuba.ac.jp",
			},
			{
				name: "キロロ",
				authId: randomUUID(),
				email: "s1111111@u.tsukuba.ac.jp",
			},
		],
		skipDuplicates: true,
	});
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
