declare module 'stormdb' {
  namespace StormDB {
    class StormDBClass {
      constructor(engine: StormDB.LocalFileEngine, options?: object);

      static localFileEngine(path: string, options?: object): LocalFileEngine;
      default(defaultValue: object): StormDBClass;
      length(): StormDBClass;
      delete(): void;
      push(value: any): void;
      get(value: any): StormDBClass;
      set(key: any, value: any): StormDBClass;
      value(): any;
      setValue(value: any, pointers: any[], setRecursively?: boolean): void;
      save(): Promise<void> | null;
    }

    class Base {
      serialize<T>(data: T): (data: T) => void;
      deserialize<T>(data: T): (data: T) => void;
    }

    class LocalFileEngine extends Base {
      constructor(path: string, options?: object);
      init(): object;
      read(): object;
      write(data: any): Promise<void> | null;
    }
  }

  export default StormDB.StormDBClass;
}
