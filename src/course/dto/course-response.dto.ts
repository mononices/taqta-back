export class SessionType {
    abbreviation: string;
    sessions: SessionDto[];
}

export class CourseResponseDto {
    _id: string;
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    start_date: string;
    end_date: string;
    types: SessionType[];
}