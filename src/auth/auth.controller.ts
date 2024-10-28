import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    await this.authService.googleCreateUser(req.user);
    res.cookie('sessionId', req.sessionID, { httpOnly: true, maxAge: 3600000 });
    // res.json({ cookie: req.sessionID, user });
    res.redirect('/products');
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    await this.authService.logout(req);
    res.clearCookie('sessionId');
    res.json({ message: 'Logout successful' });
  }
}
