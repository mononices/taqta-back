import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session{
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
    start_date: string;
    @Prop()
    end_date: string;
    @Prop()
    days: string;
    @Prop()
    time: string;
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