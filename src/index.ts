import express from "express";
import morgan from "morgan";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { PORT } from "./constants";
import { authMiddleware } from "./auth";
import { router } from "./routes";

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("tiny"));
app.use(authMiddleware);
app.use(router);

async function main() {
  app.listen(PORT, () => {
    console.log(`LISTENING IN PORT ${PORT}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
