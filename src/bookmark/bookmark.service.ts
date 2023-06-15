import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async addBookmark(userId: number, dto: BookmarkDto) {
    try {
      const bookData = await this.prisma.bookmark.create({
        data: {
          title: dto.title,
          link: dto.link,
          description: dto.description,
          userId,
        },
      });

      return bookData;
    } catch (error) {
      return error;
    }
  }
}
