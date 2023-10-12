export class StreamJsonError extends Error {
    constructor(error: unknown) {
        super('StreamJsonError');
        this.name = 'StreamJsonError';
        this.message = error as string;
    }
}