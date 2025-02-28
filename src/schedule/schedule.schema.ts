import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Course } from "src/course/course.schema";
import { Session, SessionSchema } from "src/session/session.schema";
import { User, UserSchema } from "src/user/user.schema";

@Schema()
export class Schedule {
    @Prop({type: [{ body: {type: SchemaTypes.ObjectId, ref: 'Course' }, picked: {type: Map, of: {type: SchemaTypes.ObjectId, ref: 'Session'}}}]})
    courses: Array<{body: Course, picked: Map<string, Types.ObjectId>}>;
    @Prop({type: SchemaTypes.ObjectId, ref: 'User'})
    author: User;
};

/*
export type ScheduleOverride = {
    author: Types.Subdocument<Types.ObjectId> & User;
    sessions: Types.DocumentArray<Session> 
};*/

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

export type ScheduleDocument = HydratedDocument<Schedule>;
