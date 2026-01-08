import { Module } from '@nestjs/common';
import { APP_FILTER } from "@nestjs/core";
import { UserDomainExceptionFilter } from "./filters/user-domain-exception.filter";
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Module({
  providers: [
    // Fallback (catch-all) FIRST → lower priority
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    // Specific domain errors LAST → higher priority
    { provide: APP_FILTER, useClass: UserDomainExceptionFilter },
  ],
})
export class CommonModule {}