import { Transform } from "class-transformer";
import moment from "moment";

export class CreateCourseDto {
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    ec_cr: number;
    us_cr: number;
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MMM-YY', 'DD-MMM-YYYY'], true);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MMM-YY or DD-MMM-YYYY.');
    })
    start_date: Date;
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MMM-YY', 'DD-MMM-YYYY'], true);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MMM-YY or DD-MMM-YYYY.');
    })
    end_date: Date;
    sessions?: any[];
}
