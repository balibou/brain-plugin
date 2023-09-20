import { PrismaClient } from '.prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    super();
    this.$connect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
