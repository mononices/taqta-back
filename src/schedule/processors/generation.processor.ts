import * as _ from "lodash";
import copy from 'fast-copy';
import * as moment from "moment";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, SandboxedJob } from "bullmq";

abstract class Strategy{
    abstract penalize(courses: CourseDto[], picks: any[]): number
}

class SessionType {
    abbreviation: string;
    sessions: SessionDto[];
    pick: number;
}

class SessionDto{
    _id: string;
    course_id: string;
    school: string;
    level: string;
    abbreviation: string;
    section: string;
    type: string;
    title: string;
    us_cr: string;
    ec_cr: string;
    start_date: Date;
    end_date: Date;
    days: string;
    start_time: string;
    end_time: string;
    enrolled: number;
    capacity: number;
    faculty_member: string;
    room_cap: string;
}

class CourseDto{
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
    sessions: SessionDto[][];
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

class OverlapStrategy extends Strategy{
    penaltyConstant = 1e6;
    penalize(courses: CourseDto[], picks: any[]): number {
        const sorted: SessionDto[][] = Array.from({ length: 7 }, () => []);
        var score = 0;
        
        const selected = courses.map((course, cindex) => {
            return course.types.map((type, tindex) => {
                const pick = picks[cindex].types[tindex].pick;
                return type.sessions[pick];
            });
        }).flat();

        selected.sort((x, y) => x.start_time.localeCompare(y.start_time));
        
        for(const session of selected){
            session.days.replace(/\s+/g, '').split('').map(day => {
                if(days[day]){
                    sorted[days[day]].push(session);
                }
            });
        }
        
        for(const day of sorted){
            for(var i = 0; i < day.length - 1; i++){
                if(day[i+1].start_time < day[i].end_time) score += this.penaltyConstant;
            }
        }

        return score; 
    }
}

class MinimizeWindowsStrategy extends Strategy{
    penaltyConstant = 1e3;
    penalize(courses: CourseDto[], picks: any[]): number {
        const sorted: SessionDto[][] = Array.from({ length: 7 }, () => []);
        var score = 0;
        /*
        const selected = courses.map(course => {
            return course.types.map((type) => type.sessions[type.pick]);
        }).flat();
        */

       
        const selected = courses.map((course, cindex) => {
            return course.types.map((type, tindex) => {
                const pick = picks[cindex].types[tindex].pick;
                return type.sessions[pick];
            });
        }).flat();

        //console.log(selected);

        selected.sort((x, y) => x.start_time.localeCompare(y.start_time));
        
        for(const session of selected){
            session.days.replace(/\s+/g, '').split('').map(day => {
                if(days[day]){
                    sorted[days[day]].push(session);
                }
            });
        }
        
        for(const day of sorted){
            for(var i = 0; i < day.length - 1; i++){
                if(day[i+1].start_time > day[i].end_time){

                    const start = moment(day[i + 1].start_time, "HH:mm");
                    const end = moment(day[i].end_time, "HH:mm"); 

                    const diff = start.diff(end, "minutes");
                    score += (diff) * this.penaltyConstant;
                }
            }
        }

        return score; 
    }
}

class ProfessorAvoidStrategy extends Strategy{
    blacklist: string[];

    constructor(professorBlacklist: string[]){
        super();
        this.blacklist = professorBlacklist;
    }

    penaltyConstant = 5e3;
    penalize(courses: CourseDto[], picks: any[]): number {
        var score = 0;
       
        const selected = courses.map((course, cindex) => {
            return course.types.map((type, tindex) => {
                const pick = picks[cindex].types[tindex].pick;
                return type.sessions[pick];
            });
        }).flat();

        for(const select of selected){
                const name = select.faculty_member.toLowerCase();
                for(const blacklisted of this.blacklist){
                    if(name.includes(blacklisted.toLowerCase())) score += this.penaltyConstant;
                }
        }

        return score; 
    }
}



class ScheduleBoardState{
    courses: CourseDto[];
    strategies: Strategy[];
    picks: any[];

    constructor(courses: CourseDto[], strategies: Strategy[], picks?: any[]){
        this.courses = courses;
        this.strategies = strategies;
        
        if(picks) this.picks = picks;
        else{
            this.picks = Array.from(courses, (course) => {
                const types = course.types.map((type) => {
                    return {
                        pick: 0,
                        length: type.sessions.length
                    }
                });

                return {
                    types: types
                };
            });
        }
    }

    penalty(): number{
        var penalty: number = 0;
        for(const strat of this.strategies){
            penalty += strat.penalize(this.courses, this.picks);
        }
        return penalty;
    }

    randomNeighbour(): ScheduleBoardState {
        const clone = this.copy();
        const randomIndex = (N: number) => Math.floor(Math.random() * N);
        const edition = randomIndex(clone.picks.length);
        const possible = clone.picks[edition].types.length;
        const selected = randomIndex(possible);

        clone.picks[edition].types[selected].pick += 1;
        clone.picks[edition].types[selected].pick %= clone.picks[edition].types[selected].length;
        return clone;
    }

    copy(): ScheduleBoardState{
        return new ScheduleBoardState(this.courses, this.strategies, copy(this.picks));
    }

}

class ScheduleBoard{
    state: ScheduleBoardState;

    constructor(courses: CourseDto[], strategies: Strategy[]){
        this.state = new ScheduleBoardState(courses, strategies);
    }

    neighbour(): ScheduleBoardState{
        return this.state.randomNeighbour();
    }

    simulateAnnealing({steps}){
        var optimum = this.state.copy();
        var state = this.state.copy();

        const temperature = (percent: number) => {
            return (1 - percent) * 1e9 + 0.1;
        };

        const probability = (energy, newEnergy, temp) => {
            if (newEnergy < energy){
                return 1.0;
            }

            return Math.exp((energy - newEnergy) / temp);
        }

        for(var i = 0; i < steps; i++){
            const t = temperature(i / steps);
            const neighbour = state.randomNeighbour();

            //console.log(optimum.penalty());
            //console.log(optimum.penalty());
            if(!optimum.penalty()) break;

            if(probability(state.penalty(), neighbour.penalty(), t) > Math.random()){
                state = neighbour;
            }

            if(optimum.penalty() > state.penalty()){
                optimum = state.copy();
            }
        
        }
        
        
        this.state = optimum;
        
        this.state.courses.map((course, cindex) => {
            course.types.map((type, tindex) => {
                type.pick = this.state.picks[cindex].types[tindex].pick;
            });
        });
    }
}

module.exports = async (job: SandboxedJob) => {
    const process = async (job: SandboxedJob, token?: string): Promise<any> => {
        if(job.name !== "generate") return;

        const strategies = [new OverlapStrategy()];
        const {courses, options} = job.data;

        if(options?.minimizeWindows){
            strategies.push(new MinimizeWindowsStrategy());
        }

        if(options?.professorBlacklist){
            strategies.push(new ProfessorAvoidStrategy(options.professorBlacklist));
        }

        const scheduleBoard = new ScheduleBoard(courses, strategies);
        scheduleBoard.simulateAnnealing({steps: 2048});
        
        return scheduleBoard.state.courses;
    }
    
    return process(job);
}

/*
@Processor('generator')
class GenerationProcessor extends WorkerHost {
    async process(job: Job, token?: string): Promise<any> {
        if(job.name !== "generate") return;

        const strategies = [new OverlapStrategy()];
        const {courses, options} = job.data;

        if(options?.minimizeWindows){
            strategies.push(new MinimizeWindowsStrategy());
        }

        const scheduleBoard = new ScheduleBoard(courses, strategies);
        scheduleBoard.simulateAnnealing({steps: 2048});
        
        return scheduleBoard;
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log("I AM FINISHED");
    }
}*/