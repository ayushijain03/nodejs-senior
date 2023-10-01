import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.input';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../lib/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    //console.log(req.user);
    return this.authService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify/:code')
  verifyAccount(@Req() req: any, @Param('code') code: string) {
    //console.log(req.user);
    const id = req.user.userId;
    return this.authService.verifyAccount({ id, code });
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    console.log(userId, refreshToken);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
