declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO: string;
        PORT?: number;
      }
    }
  }
  

  export {}