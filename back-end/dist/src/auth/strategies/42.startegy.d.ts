declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<void>;
}
export {};
