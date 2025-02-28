import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session{
    _id: Types.ObjectId;
    @Prop()
    course_id: string;
    @Prop()
    school: string;
    @Prop()
    level: string;
    @Prop()
    abbreviation: string;
    @Prop()
    section: string;
    @Prop()
    type: string;
    @Prop()
    title: string;
    @Prop()
    us_cr: number;
    @Prop()
    ec_cr: number;
    @Prop()
    start_date: Date;
    @Prop()
    end_date: Date;
    @Prop()
    days: string;
    @Prop()
    start_time: string;
    @Prop()
    end_time: string;
    @Prop()
    enrolled: number;
    @Prop()
    capacity: number;
    @Prop()
    faculty_member: string;
    @Prop()
    room_cap: string; 
}

export const SessionSchema = SchemaFactory.createForClass(Session);