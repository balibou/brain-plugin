import { Module } from '@nestjs/common';
import { CreateFlashcardController } from './features/create-flashcard/create-flashcard.controller';
import { CreateFlashcard } from './features/create-flashcard/create-flashcard.usecase';
import { FlashcardRepository } from './model/flashcard.repository';
import { PrismaService } from './infra/prisma.service';
import { NotifyAnswerController } from './features/notify-answer/notify-answer.controller';
import { BoxRepository } from './model/box.repository';
import { PostgresFlashcardRepository } from './infra/postgres-flashcard.repository';
import { PostgresBoxRepository } from './infra/postgres-box.repository';
import { NotifyAnswer } from './features/notify-answer/notify-answer.usecase';
import { DateProvider } from './model/date-provider';
import { RealDateProvider } from './infra/real-date-provider';
import { GetNextCardToReviewController } from './features/get-next-card-to-review/get-next-card-to-review.controller';
import { GetNextCardToReview } from './features/get-next-card-to-review/get-next-card-to-review.query';
import { ListFlashcards } from './features/list-flashcards/list-flashcards.query';
import { ListFlashcardsController } from './features/list-flashcards/list-flashcard.controller';
import { CreateFlashcardControllerBis } from './features/create-flashcard-bis/create-flashcard.controller';
import { CreateFlashcardBis } from './features/create-flashcard-bis/create-flashcard.usecase';
import { PostgresBoxRepositoryWithoutInjectable } from './infra/postgres-box-without-injectable.repository';
import { PostgresFlashcardRepositoryWithoutInjectable } from './infra/postgres-flashcard-without-injectable.repository';

@Module({
  imports: [],
  controllers: [
    CreateFlashcardController,
    CreateFlashcardControllerBis,
    NotifyAnswerController,
    GetNextCardToReviewController,
    ListFlashcardsController,
  ],
  providers: [
    CreateFlashcard,
    CreateFlashcardBis,
    NotifyAnswer,
    GetNextCardToReview,
    ListFlashcards,
    PrismaService,
    {
      provide: FlashcardRepository,
      useClass: PostgresFlashcardRepository,
    },
    {
      provide: CreateFlashcardBis,
      useFactory: () =>
        new CreateFlashcardBis(
          new PostgresFlashcardRepositoryWithoutInjectable(new PrismaService()),
          new PostgresBoxRepositoryWithoutInjectable(new PrismaService()),
        ),
    },
    {
      provide: BoxRepository,
      useClass: PostgresBoxRepository,
    },
    {
      provide: DateProvider,
      useClass: RealDateProvider,
    },
  ],
  exports: [PrismaService],
})
export class FlashcardModule {}
