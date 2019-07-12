declare module NodeJS {
  interface Global {
    waitFor: (ms: number) => Promise<void>;
    d: (obj: any) => void;
    t: number;
  }
}
