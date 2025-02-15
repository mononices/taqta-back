import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { SessionSchema } from "src/session/session.schema";

@Schema()
export class Schedule {   
    @Prop([SessionSchema])
    sessions: Types.ObjectId[];
};

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

export type ScheduleDocument = HydratedDocument<Schedule>;
