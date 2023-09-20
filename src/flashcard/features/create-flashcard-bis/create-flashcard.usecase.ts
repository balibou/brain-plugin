import { Box } from 'src/flashcard/model/box.entity';
import { BoxRepository } from 'src/flashcard/model/box.repository';
import { FlashcardRepository } from 'src/flashcard/model/flashcard.repository';

export class CreateFlashcardCommandBis {
  id: string;
  front: string;
  back: string;
  userId: string;
}

export class CreateFlashcardBis {
  constructor(
    private readonly flashcardRepository: FlashcardRepository,
    private readonly boxRepository: BoxRepository,
  ) {}

  public async execute(createFlashcardCommand: CreateFlashcardCommandBis) {
    let box: Box;
    try {
      box = await this.boxRepository.getByUserId(createFlashcardCommand.userId);
    } catch (e) {
      box = Box.emptyBoxOfIdForUser(
        this.boxRepository.getNextBoxId(),
        createFlashcardCommand.userId,
      );
      await this.boxRepository.save(box);
    }
    const flashcard = box.addNewFlashcard({
      id: createFlashcardCommand.id,
      front: createFlashcardCommand.front,
      back: createFlashcardCommand.back,
    });
    await this.flashcardRepository.save(flashcard);
  }
}
