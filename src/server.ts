import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teste Bilion API",
      version: "1.0.0",
      description: "API para teste técnico com separação de ambientes.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/server.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
const ENV_NAME = process.env.ENV_NAME || "homol";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health Check
 *     description: Verifica se a API está online e em qual ambiente.
 *     responses:
 *       200:
 *         description: Sucesso
 */
app.get("/", (req: Request, res: Response) => {
  res.send(`API is running in ${ENV_NAME} environment.`);
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               name: "Adelmo Maximo"
 *               email: "adelmo@exemplo.com"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 env:
 *                   type: string
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 */
app.post("/user", (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
  };

  users.push(newUser);
  console.log(`[${ENV_NAME}] User created: ${name}`);

  return res.status(201).json({
    env: ENV_NAME,
    ...newUser,
  });
});

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista usuários do ambiente atual
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada
 */
app.get("/user", (req: Request, res: Response) => {
  return res.status(200).json({
    env: ENV_NAME,
    total: users.length,
    users: users,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${ENV_NAME}`);
  console.log(`Swagger Docs available at /api-docs`);
});
