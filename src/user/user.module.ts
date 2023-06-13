import { Get, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserController],
})
export class UserModule {}
