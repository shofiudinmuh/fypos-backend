// import { Injectable, Scope, Inject } from '@nestjs/common';
// import { PrismaClient } from 'generated/prisma';
// import { REQUEST } from '@nestjs/core';

// @Injectable({ scope: Scope.REQUEST })
// export class PrismaService {
//     private client: PrismaClient;
//     public baseClient: PrismaClient;

//     constructor(@Inject(REQUEST) private request: any) {
//         const baseClient = new PrismaClient();
//         const tenantId = request?.headers?.['x-tenant-id'];

//         if (tenantId) {
//             this.client = baseClient.$extends({
//                 query: {
//                     $allModels: {
//                         async $allOperations({ args, query, operation }) {
//                             const operationsWithWhere = [
//                                 'findUnique',
//                                 'findFirst',
//                                 'findMany',
//                                 'update',
//                                 'delete',
//                                 'upsert',
//                                 'updateMany',
//                                 'deleteMany',
//                             ];
//                             if (operationsWithWhere.includes(operation)) {
//                                 // Type assertion untuk memberitahu TypeScript bahwa args memiliki where
//                                 const argsWithWhere = args as { where?: any };
//                                 if (argsWithWhere.where) {
//                                     argsWithWhere.where = { ...argsWithWhere.where, tenantId };
//                                 } else {
//                                     argsWithWhere.where = { tenantId };
//                                 }
//                             }
//                             return query(args);
//                         },
//                     },
//                 },
//             }) as PrismaClient; // type assertion untuk $extends
//         } else {
//             this.client = baseClient;
//         }
//     }

//     get $transaction() {
//         return this.client.$transaction.bind(this.client);
//     }

//     get tenant() {
//         return this.client.tenant;
//     }
//     get user() {
//         return this.client.user;
//     }
//     get outlet() {
//         return this.client.outlet;
//     }
//     get subscriptionPlan() {
//         return this.client.subscriptionPlan;
//     }
//     get offlineQueue() {
//         return this.client.offlineQueue;
//     }
//     get activityLog() {
//         return this.client.activityLog;
//     }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantContext } from 'src/common/context/tenant-context';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private _client: PrismaClient;

    constructor() {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        // 🔥 2. Buat adapter
        const adapter = new PrismaPg(pool);

        // 🔥 3. Inject ke PrismaClient
        const baseClient = new PrismaClient({
            adapter,
            log: ['error', 'warn'],
        });

        // Kita extend Prisma sekali saja di constructor
        this._client = baseClient.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query, operation }) {
                        // Ambil tenantId dari context ALS
                        const tenantId = tenantContext.getStore();

                        const operationsToFilter = [
                            'findUnique',
                            'findFirst',
                            'findMany',
                            'update',
                            'delete',
                            'upsert',
                            'updateMany',
                            'deleteMany',
                        ];

                        // Fix: Use tenant_id instead of tenantId to match schema.prisma
                        if (tenantId && operationsToFilter.includes(operation)) {
                            const argsWithWhere = args as { where?: any };
                            argsWithWhere.where = { ...argsWithWhere.where, tenant_id: tenantId };
                        }

                        // Added: Auto-inject tenant_id for create operations
                        if (tenantId && operation === 'create') {
                            const createArgs = args as { data?: any };
                            createArgs.data = { ...createArgs.data, tenant_id: tenantId };
                        }

                        return query(args);
                    },
                },
            },
        }) as any;
    }

    async onModuleInit() {
        // Anda bisa melakukan test koneksi di sini jika perlu
    }

    async onModuleDestroy() {
        await (this._client as any).$disconnect();
    }

    // Getter agar UseCase bisa memanggil this.prisma.$transaction
    get $transaction() {
        return this._client.$transaction.bind(this._client);
    }

    // Model Getters
    get tenant() {
        return this._client.tenant;
    }
    get user() {
        return this._client.user;
    }
    get outlet() {
        return this._client.outlet;
    }
    get subscriptionPlan() {
        return this._client.subscriptionPlan;
    }
    get subscriptionPayment() {
        return this._client.subscriptionPayment;
    }
    get permission() {
        return this._client.permission;
    }
    get rolePermission() {
        return this._client.rolePermission;
    }
    get userPermission() {
        return this._client.userPermission;
    }
    get session() {
        return this._client.session;
    }
    get token() {
        return this._client.token;
    }
    get passwordResetToken() {
        return this._client.passwordResetToken;
    }
    get shiftLog() {
        return this._client.shiftLog;
    }
    get activityLog() {
        return this._client.activityLog;
    }
    get apiLog() {
        return this._client.apiLog;
    }
    get auditLog() {
        return this._client.auditLog;
    }
    get offlineQueue() {
        return this._client.offlineQueue;
    }

    get productCategory() {
        return this._client.productCategory;
    }

    get product() {
        return this._client.product;
    }

    get productVariant() {
        return this._client.productVariant;
    }

    get unit() {
        return this._client.unit;
    }

    get ingredient() {
        return this._client.ingredient;
    }

    get productIngredient() {
        return this._client.productIngredient;
    }

    get register() {
        return this._client.register;
    }

    get device() {
        return this._client.device;
    }

    get paymentMethod() {
        return this._client.paymentMethod;
    }

    get orderSession() {
        return this._client.orderSession;
    }

    get orderItem() {
        return this._client.orderItem;
    }

    get sale() {
        return this._client.orderSession;
    }

    get saleItem() {
        return this._client.saleItem;
    }

    get salePayment() {
        return this._client.salePayment;
    }

    get refund() {
        return this._client.refund;
    }
}

// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { tenantContext } from 'src/common/context/tenant-context';

// @Injectable()
// export class PrismaService implements OnModuleInit, OnModuleDestroy {
//     // Gunakan 'any' untuk _client karena tipe Prisma Extension sangat kompleks
//     private _client: any;

//     constructor() {
//         // 1. Inisialisasi base client secara standar
//         const baseClient = new PrismaClient({
//             log: ['error', 'warn'],
//         });

//         // 2. Terapkan Extension
//         this._client = baseClient.$extends({
//             query: {
//                 $allModels: {
//                     async $allOperations({ model, operation, args, query }) {
//                         const tenantId = tenantContext.getStore();

//                         const operationsToFilter = [
//                             'findUnique',
//                             'findFirst',
//                             'findMany',
//                             'update',
//                             'delete',
//                             'upsert',
//                             'updateMany',
//                             'deleteMany',
//                         ];

//                         // LOGIC MULTI-TENANCY
//                         // Pastikan model bukan 'Tenant' agar tidak terjadi rekursif/filter pada tabel induk
//                         if (
//                             tenantId &&
//                             model !== 'Tenant' &&
//                             operationsToFilter.includes(operation)
//                         ) {
//                             args.where = {
//                                 ...args.where,
//                                 tenant_id: tenantId, // Sesuai nama field di schema.prisma kamu
//                             };
//                         }

//                         return query(args);
//                     },
//                 },
//             },
//         });
//     }

//     async onModuleInit() {
//         // Sangat disarankan untuk eksplisit connect saat startup
//         await this._client.$connect();
//     }

//     async onModuleDestroy() {
//         await this._client.$disconnect();
//     }

//     // Getter untuk transaksi
//     get $transaction() {
//         return this._client.$transaction;
//     }

//     // Model Getters (Pastikan nama sesuai model di schema.prisma)
//     get tenant() {
//         return this._client.tenant;
//     }
//     get user() {
//         return this._client.user;
//     }
//     get outlet() {
//         return this._client.outlet;
//     }
//     get subscriptionPlan() {
//         return this._client.subscriptionPlan;
//     }
// }

// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { Pool } from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';

// @Injectable()
// export class PrismaService implements OnModuleInit, OnModuleDestroy {
//     // private _client: PrismaClient;
//     private _client: ReturnType<PrismaClient['$extends']>;

//     constructor() {
//         // 🔥 1. Buat pool manual
//         const pool = new Pool({
//             connectionString: process.env.DATABASE_URL,
//         });

//         // 🔥 2. Buat adapter
//         const adapter = new PrismaPg(pool);

//         // 🔥 3. Inject ke PrismaClient
//         const baseClient = new PrismaClient({
//             adapter,
//             log: ['error', 'warn'],
//         });

//         this._client = baseClient.$extends({
//             query: {
//                 $allModels: {
//                     async $allOperations({ model, operation, args, query }) {
//                         const tenantId = tenantContext.getStore();
//                         const dynamicArgs = args as any;

//                         const ops = [
//                             'findUnique',
//                             'findFirst',
//                             'findMany',
//                             'update',
//                             'delete',
//                             'upsert',
//                             'updateMany',
//                             'deleteMany',
//                         ];

//                         if (tenantId && model !== 'Tenant' && ops.includes(operation)) {
//                             dynamicArgs.where = dynamicArgs.where || {};
//                             dynamicArgs.where = {
//                                 ...dynamicArgs.where,
//                                 tenant_id: tenantId,
//                             };
//                         }

//                         if (tenantId && model !== 'Tenant' && operation === 'create') {
//                             dynamicArgs.data = {
//                                 ...dynamicArgs.data,
//                                 tenant_id: tenantId,
//                             };
//                         }

//                         return query(dynamicArgs);
//                     },
//                 },
//             },
//         });
//     }

//     async onModuleInit() {
//         await this._client.$connect();
//     }

//     async onModuleDestroy() {
//         await this._client.$disconnect();
//     }

//     get user() {
//         return this._client.user;
//     }
// }
