declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    ALLOWED_ORIGIN_PATTERNS?: string;
    DATABASE_CONNECTION_STRING: string;
  }
}
