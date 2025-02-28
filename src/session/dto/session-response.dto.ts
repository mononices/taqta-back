import { StringExpressionOperatorReturningBoolean } from "mongoose";
import { Session, SessionDocument } from "../session.schema";
import { Expose, plainToInstance, Transform } from "class-transformer";
import * as moment from "moment";
import { IsOptional } from "class-validator";

export class SessionDto{
    @IsOptional()
    @Expose()
    // stops class-transformer from changing the object id
    @Transform((value) => value.obj._id.toString())
    _id: string;
    @Expose()
    course_id: string;
    @Expose()
    school: string;
    @Expose()
    level: string;
    @Expose()
    abbreviation: string;
    @Expose()
    section: string;
    @Expose()
    type: string;
    @Expose()
    title: string;
    @Expose()
    us_cr: string;
    @Expose()
    ec_cr: string;
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MMM-YY', 'DD-MMM-YYYY'], true);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MMM-YY or DD-MMM-YYYY.');
    })
    @Expose()
    start_date: Date;
    @Expose()
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MMM-YY', 'DD-MMM-YYYY'], true);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MMM-YY or DD-MMM-YYYY.');
    })
    end_date: Date;
    @Expose()
    days: string;
    @Expose()
    start_time: string;
    @Expose()
    end_time: string;
    @Expose()
    enrolled: number;
    @Expose()
    capacity: number;
    @Expose()
    faculty_member: string;
    @Expose()
    room_cap: string;

    static fromDocument(document: Session){
        return plainToInstance(SessionDto, document, {excludeExtraneousValues: true}); 
    }
}