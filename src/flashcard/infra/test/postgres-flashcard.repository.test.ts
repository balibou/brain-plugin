import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PostgresFlashcardRepository } from '../postgres-flashcard.repository';
import { PrismaService } from '../prisma.service';
import { Flashcard } from 'src/flashcard/model/flashcard.entity';

const asyncExec = promisify(exec);

describe('PostgresFlashcardRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaService;
  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('brain-test')
      .withUsername('brain-test')
      .withPassword('brain-test')
      .withExposedPorts(5432)
      .start();
    const databaseUrl = `postgresql://brain-test:brain-test@${container.getHost()}:${container.getMappedPort(
      5432,
    )}/brain-test?schema=public`;
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    }) as PrismaService;
    await asyncExec(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`);

    await prismaClient.$connect();
  });

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.flashcard.deleteMany();
  });

  test('save() should save a new flashcard', async () => {
    const flashcardRepository = new PostgresFlashcardRepository(prismaClient);
    const flashcardId = 'flashcard-id';

    await flashcardRepository.save(
      new Flashcard(
        flashcardId,
        'some concept',
        'definition of the concept',
        'partition-id',
      ),
    );

    const expectedFlashcard = await prismaClient.flashcard.findUnique({
      where: { id: flashcardId },
    });
    expect(expectedFlashcard).toEqual({
      id: flashcardId,
      front: 'some concept',
      back: 'definition of the concept',
      partitionId: 'partition-id',
    });
  });

  test('save() should update an existing flashcard', async () => {
    const flashcardRepository = new PostgresFlashcardRepository(prismaClient);
    const flashcardId = 'flashcard-id';
    await flashcardRepository.save(
      new Flashcard(
        flashcardId,
        'some concept',
        'definition of the concept',
        'partition-id',
      ),
    );

    await flashcardRepository.save(
      new Flashcard(
        flashcardId,
        'some other concept',
        'definition of the other concept',
        'partition2-id',
      ),
    );

    const expectedFlashcard = await prismaClient.flashcard.findUnique({
      where: { id: flashcardId },
    });
    expect(expectedFlashcard).toEqual({
      id: flashcardId,
      front: 'some other concept',
      back: 'definition of the other concept',
      partitionId: 'partition2-id',
    });
  });

  test('getById() should return a flashcard by its id', async () => {
    const flashcardRepository = new PostgresFlashcardRepository(prismaClient);
    const flashcardId = 'flashcard-id';
    await flashcardRepository.save(
      new Flashcard(
        flashcardId,
        'some concept',
        'definition of the concept',
        'partition-id',
      ),
    );

    const expectedFlashcard = await flashcardRepository.getById(flashcardId);

    expect(expectedFlashcard).toEqual({
      id: flashcardId,
      front: 'some concept',
      back: 'definition of the concept',
      partitionId: 'partition-id',
    });
  });
});
