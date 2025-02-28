import { Types } from "mongoose";

export class ScheduleDto {
    _id?: string;
    courses: Array<{body: Types.ObjectId, picked: Record<string, string>}>   
}

export class ScheduleListDto {
    schedules: Array<ScheduleDto>
}