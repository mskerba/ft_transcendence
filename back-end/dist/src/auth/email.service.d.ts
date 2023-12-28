export declare class EmailService {
    private transporter;
    constructor();
    sendMail(to: string, subject: string, html: string): Promise<void>;
}
