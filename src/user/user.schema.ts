import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Schedule, ScheduleSchema } from "src/schedule/schedule.schema";

export enum Role {
    ADMIN = "admin",
    STUDENT = "student",
    FACULTY = "faculty",
    HEAD = "head",
};

@Schema()
export class User {
    @Prop({unique: true})
    email: string;
    @Prop()
    hash?: string;
    @Prop({type: [SchemaTypes.ObjectId], ref: 'Schedule'})
    schedules: Schedule[];
    @Prop()
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;