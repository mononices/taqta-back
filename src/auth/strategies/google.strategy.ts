import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { User } from "src/user/user.schema";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import { configuration } from "src/config/configuration";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(
        @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
        @InjectModel("User") private userModel: Model<User>
    ){
        super({
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackUrl,
            scope: ['profile', 'email']
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback
    ){
        const {id, name, emails, photos } = profile;

        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value
        };

        done(null, user);
    }
};