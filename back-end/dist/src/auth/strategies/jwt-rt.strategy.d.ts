import { Request } from 'express';
declare const JwtRTStrategy_base: new (...args: any[]) => any;
export declare class JwtRTStrategy extends JwtRTStrategy_base {
    constructor();
    validate(req: Request, payload: any): any;
}
export {};
