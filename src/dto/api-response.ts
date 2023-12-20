export class APIResponse<T = any> {
    constructor(
      public status?: string,
      public message?: string,
      public data?: T
    ) {}
  }