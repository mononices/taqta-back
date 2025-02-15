import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configuration } from "src/config/configuration";
import { User } from "src/user/user.schema";

export type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        @Inject(configuration.KEY) private configService: ConfigType<typeof configuration>,
        @InjectModel("User") private userModel: Model<User>
    ) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if(req && req.cookies) {
                token = req.cookies['access_token'];
            }

            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        }

        super({
            ignoreExpiration: false,
            secretOrKey: configService.jwt.secret,
            jwtFromRequest: extractJwtFromCookie
        })
    }

    async validate(payload: JwtPayload){
        const user = await this.userModel.findOne({ email: { $eq: payload.email }}).exec();
        if(!user) throw new UnauthorizedException('Please login to continue');

        return {
            id: payload.sub,
            email: payload.email
        };
    }

}