import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseDto<T>> {
        return next.handle().pipe(map((data) => new ApiResponseDto(true, 'success', data)));
    }
}
