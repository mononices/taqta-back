import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ScheduleSchema } from "src/schedule/schedule.schema";

@Schema()
export class User {
    @Prop({unique: true})
    email: string;
    @Prop()
    hash?: string;
    @Prop([ScheduleSchema])
    schedules: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;