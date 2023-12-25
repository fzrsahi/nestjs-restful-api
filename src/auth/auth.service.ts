import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
      throw e;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Account Not Found!');
    try {
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Account Not Found!');
      delete user.hash;

      const token = await this.signToken(user.id, user.email);

      return {
        status: 'success',
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signToken(id: number, email: string): Promise<string> {
    const payload = { sub: id, email };
    return this.jwt.signAsync(payload, {
      expiresIn: '20m',
      secret: this.config.get('SECRET_TOKEN'),
    });
  }
}
