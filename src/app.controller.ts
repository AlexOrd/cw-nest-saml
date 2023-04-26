import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { resolve } from 'path';
import express from 'express';
import { SamlAuthGuard } from './auth/saml-auth.guard';
import { UserService } from './user/user.service';
import { User } from './model/user';
import { SamlStrategy } from './auth/saml.strategy';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly samlStrategy: SamlStrategy,
  ) {}

  @Get()
  async homepage(@Response() res: express.Response) {
    res.sendFile(resolve('web/index.html'));
  }

  @Get('api/auth/sso/saml/login')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    //this route is handled by passport-saml
    return;
  }

  @Post('api/auth/sso/saml/ac')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(
    @Request() req: express.Request,
    @Response() res: express.Response,
  ) {
    //this routes gets executed on successful assertion from IdP
    if (req.user) {
      const user = req.user as User;
      user.isAuthorized = true;
      this.userService.storeUser(user);
      this, res.redirect('/?email=' + user.email);
    }
  }

  @Get('api/profile')
  getProfile(@Request() req: any) {
    const user = this.userService.retrieveUser(req.query.email);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  @Get('api/auth/sso/saml/metadata')
  async getSpMetadata(@Response() res: express.Response) {
    const ret = this.samlStrategy.generateServiceProviderMetadata(null, null);
    res.type('application/xml');
    res.send(ret);
  }
}
