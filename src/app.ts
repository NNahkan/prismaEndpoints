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
/* 
app.post("/characters", (req, res) => {
	characters.push(req.body);
	res.status(201).send(req.body);
});

app.patch(".characters/:id", (req, res) => {
	const id = +req.params.id;
	characters = characters.map((char) =>
		char.id === id ? { ...char, ...req.body } : char
	);
	res.status(201).send(characters.find((char) => char.id));
});
 */
app.listen(3000);
