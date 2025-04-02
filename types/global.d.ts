declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly NEXT_PUBLIC_MONAD_SUBGRAPH_URL: string;
      readonly CHESS_SERVICE: string;
      readonly CS_MIDDLEWARE_SERVICE: string;
      readonly DATHOST_PASSWORD: string;
      readonly DATHOST_USERNAME: string;
      readonly NEXT_PUBLIC_HASURA_SUBGRAPH_URL: string;
    }
  }
}

export {};
