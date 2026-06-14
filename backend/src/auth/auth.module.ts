import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; // Importación local
import { AuthService } from './auth.service';       // Importación local

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}