import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

const prisma = new PrismaClient()


app.use(express.json());




// INDEX ENDPOINT
app.get("/characters", async (req, res) => {
	const nameHas = req.query.nameHas as string
	const characters = await prisma.character.findMany({
		where: {
			name: {
				contains: nameHas
			}
		}
	});
	res.send(characters)
});

// SHOW ENDPOINT
app.get("/characters/:id", async (req, res) => {
	const id = +req.params.id;

	const character = await prisma.character.findUnique({
		where: {
			id,
		}
	})

	if (!character) {
		return res.status(204).send('No Content')
	}

	res.send(character)
});


app.delete("/characters/:id", async (req, res) => {
	const id = +req.params.id;
	const deleted = await Promise.resolve()
		.then(() =>
			prisma.character.delete({
				where: {
					id,
				}
			})
		)
		.catch(() => null);

	if (deleted === null) {
		return res.status(404).send("Character not found");
	}

	return res.status(200).send("Great Success")
});
app.post("/characters", async (req, res) => {
	const body = req.body;
	const name = body?.name;
	if (typeof name !== "string") {
		return res.status(400).send("Name must be a string")
	}

	try {
		const newCharacter = await prisma.character.create({
			data: {
				name,
			}
		})
		res.status(201).send(newCharacter);
	} catch (e) {
		console.error(e)
		res.status(500)
	}

});


app.patch("/characters/:id", async (req, res) => {
	const id = +req.params.id;
	const name = req.body?.name

	if (typeof name !== "string") {
		return res.status(400).send("Name must be a string")
	}

	try {
		const updatedCharacter = await prisma.character.update({
			where: {
				id,
			},
			data: {
				name,
			}
		})
		res.status(201).send(updatedCharacter)
	} catch (e) {
		console.error("Name must be string!")
		res.status(500)
	}
});

app.listen(3000);
