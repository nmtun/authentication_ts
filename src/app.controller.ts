import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from './user.entity';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.appService.create({
      name,
      email,
      password: hashedPassword
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.appService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Wrong password');
    }

    const accessToken = await this.jwtService.signAsync({ id: user.id, email: user.email });

    response.cookie('jwt', accessToken, { httpOnly: true });

    return {
      message: "Login successful",
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken
    };
  }

  @Post('add-post')
  @UseGuards(AuthGuard)
  async addPost(
    @Body('title') title: string,
    @Body('content') content: string,
    @Request() req: ExpressRequest,
  ) {
    const user = await this.appService.findOneByEmail((req.user as User).email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.appService.createPost({
      title,
      content,
      user
    });
  }
  
  @Get('get-all-posts')
  @UseGuards(AuthGuard)
  async getAllPosts(
    @Request() req: ExpressRequest
  ) {
    const userId = (req.user as User).id;
    return this.appService.findPostsByUser(userId);
  }
}