declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly FIREBASE_APIKEY: string
      readonly FIREBASE_AUTHDOMAIN: string
      readonly FIREBASE_PROJECTID: string
      readonly FIREBASE_STORAGEBUCKET: string
      readonly FIREBASE_MESSAGINGSENDERID: string
      readonly FIREBASE_APPID: string
    }
  }
}

export { };
