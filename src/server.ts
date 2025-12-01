import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const ENV_NAME = process.env.ENV_NAME || "local";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send(`API is running in ${ENV_NAME} environment.`);
});

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
});
