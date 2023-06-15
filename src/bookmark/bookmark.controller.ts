import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto, EditBookmarkDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
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
    return this.bookmark.createBookmark(userId, dto);
  }

  @Get()
  getBookmars() {
    return this.bookmark.getBookmarks();
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId,
    @Param('id', ParseIntPipe) bookmarkId,
  ) {
    return this.bookmark.getBookmarkById(userId, bookmarkId);
  }

  @Patch(':id')
  updateBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmark.updateBookmarkById(bookmarkId, dto);
  }

  @Delete(':id')
  deleteBookmarkById(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmark.deleteBookmarkById(bookmarkId);
  }
}
