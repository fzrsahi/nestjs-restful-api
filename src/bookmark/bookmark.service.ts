import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: BookmarkDto) {
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

  getBookmarks() {
    try {
      const data = this.prisma.bookmark.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return data;
    } catch (error) {
      return error;
    }
  }

  async getBookmarkById(userId: number, bookId: number) {
    try {
      const bookmarkById = await this.prisma.bookmark.findUnique({
        where: {
          id: bookId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return bookmarkById;
    } catch (error) {
      return error;
    }
  }

  async updateBookmarkById(bookId: number, dto: EditBookmarkDto) {
    try {
      const data = await this.prisma.bookmark.update({
        where: {
          id: bookId,
        },
        data: {
          ...dto,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return data;
    } catch (error) {
      return error;
    }
  }

  async deleteBookmarkById(bookId: number) {
    try {
      await this.prisma.bookmark.delete({
        where: {
          id: bookId,
        },
      });

      return {
        success: true,
        message: `Bookmark with id ${bookId} deleted`,
      };
    } catch (error) {
      return error;
    }
  }
}
