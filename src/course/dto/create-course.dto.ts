export class CreateCourseDto {
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    start_date: string;
    end_date: string;
    sessions?: any[];
}
