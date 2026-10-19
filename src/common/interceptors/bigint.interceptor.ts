import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.stringifyBigInt(data)),
    );
  }

  private stringifyBigInt(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'bigint') {
      return data.toString();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.stringifyBigInt(item));
    }

    if (typeof data === 'object') {
      const result: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          result[key] = this.stringifyBigInt(data[key]);
        }
      }
      return result;
    }

    return data;
  }
}
