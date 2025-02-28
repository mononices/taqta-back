import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import { HydratedDocument, ObjectId, SchemaTypes, Types } from 'mongoose';
import { Session, SessionSchema } from 'src/session/session.schema';

@Schema()
export class Course{
    _id: Types.ObjectId;
    @Prop()
    school: string;
    @Prop()
    level: string;
    @Prop({ unique: true })
    abbreviation: string;
    @Prop()
    title: string;
    @Prop()
    ec_cr: number;
    @Prop()
    us_cr: number;
    @Prop()
    start_date: Date;
    @Prop()
    end_date: Date;
    @Prop({type: [SchemaTypes.ObjectId], ref: 'Session'})
    sessions: [Session]
    
    @Virtual({
        get: function (this: Course) {
            return this.sessions.filter(session => session.type === 'Lb') 
        }
    })
    labs: [Session]
    
    @Virtual({
        get: function (this: Course) {
            return this.sessions.filter(session => session.type === 'Int') 
        }
    })
    internships: [Session]

    @Virtual({
        get: function (this: Course) {
            return this.sessions.filter(session => session.type === 'R') 
        }
    })
    recitations: [Session]


    @Virtual({
        get: function (this: Course) {
            return this.sessions.filter(session => session.type === 'L') 
        }
    })
    lectures: [Session]


    @Virtual({
        get: function (this: Course) {
            return this.sessions.filter(session => session.type === 'S') 
        }
    })
    seminars: [Session]
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export class OverrideCourse extends OmitType(Course, ['sessions'] as const){
    sessions: Types.DocumentArray<Session> 
}

export type CourseDocument = HydratedDocument<Course>;