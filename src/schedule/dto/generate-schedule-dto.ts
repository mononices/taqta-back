export class Options{
    minimizeWindows?: boolean;
    professorBlacklist?: string[];
}

export class GenerateDto{
    id: number;
    options?: Options;
}