import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { GoogleOauthGuard } from "./guards/google-oauth.guard";
import { AuthService } from "./auth.service";

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async auth(){
        
    }

    @Post('google/callback')
    async googleAuthPostCallback(@Req() req, @Res() res){
        const token = await this.authService.signIn(req.body.user);
        return res.json({token: token});
    }

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res() res){
        const token = await this.authService.signIn(req.user);

        res.cookie('access_token', token, {
            maxAge: 2592000000,
            sameSite: true,
            secure: false
        });
        return res.json({token: token});
    }
}