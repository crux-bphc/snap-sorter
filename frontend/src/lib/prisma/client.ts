import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient({ log: ['warn', 'error', 'info'] });
export default prismaClient;
