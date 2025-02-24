import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';
import { BoxRepository } from '../model/box.repository';
import { Box, Partition } from '../model/box.entity';

export class PostgresBoxRepositoryWithoutInjectable implements BoxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<Box> {
    const boxData = await this.prisma.box.findFirstOrThrow({
      where: { userId },
      select: {
        id: true,
        userId: true,
        Partition: {
          select: {
            id: true,
          },
          orderBy: {
            partitionNumber: 'asc',
          },
        },
      },
    });

    return new Box(
      boxData.id,
      [
        new Partition(boxData.Partition[0].id),
        new Partition(boxData.Partition[1].id),
        new Partition(boxData.Partition[2].id),
        new Partition(boxData.Partition[3].id),
        new Partition(boxData.Partition[4].id),
      ],
      new Partition(boxData.Partition[5].id),
      boxData.userId,
    );
  }

  getNextBoxId(): string {
    return uuidv4();
  }

  async getById(boxId: string): Promise<Box> {
    const boxData = await this.prisma.box.findUniqueOrThrow({
      where: { id: boxId },
      select: {
        id: true,
        userId: true,
        Partition: {
          select: {
            id: true,
          },
          orderBy: {
            partitionNumber: 'asc',
          },
        },
      },
    });

    return new Box(
      boxData.id,
      [
        new Partition(boxData.Partition[0].id),
        new Partition(boxData.Partition[1].id),
        new Partition(boxData.Partition[2].id),
        new Partition(boxData.Partition[3].id),
        new Partition(boxData.Partition[4].id),
      ],
      new Partition(boxData.Partition[5].id),
      boxData.userId,
    );
  }

  async save(box: Box): Promise<void> {
    await this.prisma.box.upsert({
      where: { id: box.id },
      update: { id: box.id },
      create: {
        id: box.id,
        userId: box.userId,
      },
    });
    await this.prisma.partition.createMany({
      skipDuplicates: true,
      data: [
        {
          boxId: box.id,
          id: box.partitions[0].id,
          partitionNumber: 1,
        },
        {
          boxId: box.id,
          id: box.partitions[1].id,
          partitionNumber: 2,
        },
        {
          boxId: box.id,
          id: box.partitions[2].id,
          partitionNumber: 3,
        },
        {
          boxId: box.id,
          id: box.partitions[3].id,
          partitionNumber: 4,
        },
        {
          boxId: box.id,
          id: box.partitions[4].id,
          partitionNumber: 5,
        },
        {
          boxId: box.id,
          id: box.archivedPartition.id,
          partitionNumber: 6,
        },
      ],
    });
  }
}
