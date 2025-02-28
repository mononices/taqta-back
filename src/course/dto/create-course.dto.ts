import { Transform } from "class-transformer";
import * as moment from "moment";

export class CreateCourseDto {
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    ec_cr: number;
    us_cr: number;
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MM-YY', 'DD-MM-YYYY']);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MM-YY or DD-MM-YYYY.');
    })
    start_date: Date;
    @Transform(({ value }) => {
        const parsedDate = moment(value, ['DD-MM-YY', 'DD-MM-YYYY']);
        if (parsedDate.isValid()) {
            return parsedDate.toDate(); 
        }
        throw new Error('Invalid date format. Use DD-MM-YY or DD-MM-YYYY.');
    })
    end_date: Date;
    sessions?: any[];
}
