import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ModelModule } from './model/model.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ModelModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
