export function jsonParser(data: string) {
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
        this.name = 'JsonError';
    }
}