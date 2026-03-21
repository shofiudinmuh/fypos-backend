import { Injectable, Scope, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class PrismaService extends PrismaClient {
  constructor(@Inject(REQUEST) private request: any) {
    super();
    const tenantId = request?.header?.['x-tenant-id'];
    if (tenantId) {
      // row-level security via Prisma middleware
      this.$use(async (params, next) => {
        if (['find', 'update', 'delete'].includes(params.action)) {
          params.args.where = { ...params.args.where, tenantId };
        }
        return next(params);
      });
    }
  }
}
