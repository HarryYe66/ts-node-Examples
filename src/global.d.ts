// src/global.d.ts
declare namespace Express {
  export interface RabbitMessages {
    action: string
    data: any
  }
}
