import { SessionDto } from "src/session/dto/session-response.dto";
import { Course, CourseDocument } from "../course.schema";
import { Session } from "src/session/session.schema";
import * as moment from 'moment';

export class SessionType {
    abbreviation: string;
    sessions: SessionDto[];
    pick: number;
}

const days = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
    S: 5,
    N: 6
}

export class CourseDto {
    _id: string | undefined;
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    ec_cr: number;
    us_cr: number;
    start_date: string;
    end_date: string;
    types: SessionType[];
    sessions: Session[][];

    static fromDocument(document: CourseDocument | Course): CourseDto{
        const inferred = {};
        console.log(document);
        const sortedSessions: Session[][] = Array.from({ length: 7 }, () => []);
        for(const session of document.sessions){
            session.days.replace(/\s+/g, '').split('').map(day => {
                if(days[day]){
                    sortedSessions[days[day]].push(session);
                }
            });

            if(!inferred[session.type]) inferred[session.type] = {
                abbreviation: session.type,
                sessions: [],
                pick: 0
            };
            inferred[session.type].sessions.push(SessionDto.fromDocument(session));
        }        
        
        const inferredTypes: SessionType[] = Object.values(inferred);
        sortedSessions.map(sessionList => sessionList.sort((x, y) => x.start_time.localeCompare(y.start_time)))

        const responseDto = {
            _id: document._id?.toString(),
            school: document.school,
            level: document.level,
            abbreviation: document.abbreviation,
            title: document.title,
            ec_cr: document.ec_cr,
            us_cr: document.us_cr,
            start_date: moment(document.start_date).format("DD-MM-YY"),
            end_date: moment(document.end_date).format("DD-MM-YY"),
            types: inferredTypes,
            sessions: sortedSessions
        }
        
        return responseDto;
    }   
}

export class CourseResponseDto {
    _id: string | undefined;
    school: string;
    level: string;
    abbreviation: string;
    title: string;
    ec_cr: number;
    us_cr: number;
    start_date: string;
    end_date: string;
    types: SessionType[];

    static fromDocument(document: CourseDocument | Course): CourseResponseDto{
        const inferred = {};
        for(const session of (document.sessions)){
            if(!inferred[session.type]) inferred[session.type] = {
                abbreviation: session.type,
                sessions: [],
                pick: 0
            };
            inferred[session.type].sessions.push(SessionDto.fromDocument(session));
        }        
        
        const inferredTypes: SessionType[] = Object.values(inferred);

        const responseDto = {
            _id: document._id?.toString(),
            school: document.school,
            level: document.level,
            abbreviation: document.abbreviation,
            title: document.title,
            ec_cr: document.ec_cr,
            us_cr: document.us_cr,
            start_date: moment(document.start_date).format("DD-MM-YY"),
            end_date: moment(document.end_date).format("DD-MM-YY"),
            types: inferredTypes
        }
        
        return responseDto;
    }
}