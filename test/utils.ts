export const waitFor = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
