import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { SamlAuthGuard } from './saml-auth.guard';
import { SamlStrategy } from './saml.strategy';

@Module({
  imports: [PassportModule, UserModule],
  providers: [SamlAuthGuard, SamlStrategy],
  exports: [SamlStrategy],
})
export class AuthModule {}
