import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateFlashcardBis } from './create-flashcard.usecase';
import { CreateFlashcardDtoBis } from './create-flashcard.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('api/flashcardBis')
export class CreateFlashcardControllerBis {
  constructor(private readonly createFlashcard: CreateFlashcardBis) {}

  @ApiOperation({
    description:
      'Use this endpoint to create a flashcard composed of a front representing a concept, and a back containing the definition of this concept. Generate a uuid v4 as the flashcard id',
  })
  @Post('create')
  async create(@Body() createFlashcardDto: CreateFlashcardDtoBis, @Req() req) {
    await this.createFlashcard.execute({
      id: createFlashcardDto.id,
      front: createFlashcardDto.front,
      back: createFlashcardDto.back,
      userId: req.user.uid,
    });
  }
}
