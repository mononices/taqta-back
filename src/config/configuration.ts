import { registerAs } from "@nestjs/config";

export const configuration = registerAs('config', () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL
    },
    THROTTLE_TTL: 60000,
    THROTTLE_LIMIT: 6000
}));