export function jsonParser(data: any) {
    try {
        return JSON.parse(data);
    } catch (error) {
        throw new JsonError()
    }
}



export class JsonError extends Error {
    constructor() {
        super();
        this.message = 'Invalid JSON';
        this.cause = 'Provided data is an invalid JSON';
        this.name = 'JsonError';
    }
}