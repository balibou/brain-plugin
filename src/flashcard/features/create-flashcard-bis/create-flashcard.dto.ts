import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardDtoBis {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  front: string;

  @IsString()
  @IsNotEmpty()
  back: string;
}
