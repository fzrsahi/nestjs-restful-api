import { IsString } from 'class-validator';

export class BookmarkDto {
  @IsString()
  title: string;
  @IsString()
  description?: string;
  @IsString()
  link: string;

  userId: number;
}
