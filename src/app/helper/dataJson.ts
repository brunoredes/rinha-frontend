export function isValidJson(data: object): boolean {
    return data && typeof data === 'object' && data !== null;
}