declare module 'stormdb' {
  namespace StormDB {
    class StormDBClass {
      constructor(engine: StormDB.LocalFileEngine, options?: object);

      static browserEngine(path: string, options?: object): BrowserEngine;
      static localFileEngine(path: string, options?: object): LocalFileEngine;
      default(defaultValue: object): StormDBClass;
      length(): StormDBClass;
      delete(): void;
      push(value: any): void;
      get(value: any): StormDBClass;
      set(key: any, value: any): StormDBClass;
      map<T>(func: (value: any, index?: number, array?: any[]) => T): StormDBClass;
      sort<T>(func: (a: T, b: T) => number): StormDBClass;
      filter<T, S extends T>(func: (value: T, index?: number, array?: T[]) => value is S): StormDBClass;
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
  }

  export default StormDB.StormDBClass;
}
