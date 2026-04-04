export class ApiResponseDto<T = any> {
    constructor(
        public readonly success: boolean,
        public readonly message: string,
        public readonly data?: T,
        public readonly meta?: any,
        public readonly timestamp: string = new Date().toDateString(),
    ) {}
}
