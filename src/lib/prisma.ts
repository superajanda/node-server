import { PrismaClient } from "@prisma/client";
import { __prod__ } from "../constants";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (!__prod__) {
  global.prisma = prisma;
}
