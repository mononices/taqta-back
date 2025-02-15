import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/user.schema";
import { configuration } from "src/config/configuration";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [configuration.KEY],
            useFactory: (config: ConfigType<typeof configuration>) => ({
                secret: config.jwt.secret,
                signOptions: { expiresIn: '24h' }
            }),
            global: true,
        }),
        MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}