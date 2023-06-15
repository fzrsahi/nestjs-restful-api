import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private prisma: PrismaService,
    private bookmark: BookmarkService,
  ) {}

  @Post()
  addBook(@GetUser('id') userId, @Body() dto: BookmarkDto) {
    return this.bookmark.addBookmark(userId, dto);
  }
}
