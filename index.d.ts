declare module 'stormdb' {
  class StormDB {
    constructor(engine: LocalFileEngine, options?: object);

    static browserEngine: typeof BrowserEngine;
    static localFileEngine: typeof LocalFileEngine;

    default(defaultValue: object): StormDB;
    length(): StormDB;
    delete(): void;
    push(value: any): void;
    get(value: any): StormDB;
    set(key: any, value: any): StormDB;
    map<T>(func: (value: any, index?: number, array?: any[]) => T): StormDB;
    sort<T>(func: (a: T, b: T) => number): StormDB;
    filter<T, S extends T>(func: (value: T, index?: number, array?: T[]) => value is S): StormDB;
    value(): any;
    setValue(value: any, pointers: any[], setRecursively?: boolean): void;
    save(): Promise<void> | null;
  }

  class LocalFileEngine {
    constructor(path: string, options?: object);
    init(): object;
    read(): object;
    write(data: any): Promise<void> | null;
  }

  class BrowserEngine {
    constructor(path: string, options?: object);
    init(): object;
    read(): object;
    write(data: any): Promise<void> | null;
  }

  export = StormDB;
}
