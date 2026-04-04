import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateOutletDto } from '../dto/create-outlet.dto';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CreateOutletUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, userId: string, dto: CreateOutletDto) {
        try {
            const outletCode = `OUT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

            const outlet = await this.prisma.$transaction(async (tx) => {
                const newOutlet = await tx.outlet.create({
                    data: {
                        tenant_id: tenantId,
                        name: dto.name,
                        address: dto.address,
                        phone: dto.phone,
                        outlet_code: outletCode,
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: newOutlet.outlet_id,
                        user_id: userId,
                        action: 'CREATE',
                        entity: 'Outlet',
                        entity_id: newOutlet.outlet_id,
                        new_value: {
                            name: newOutlet.name,
                            address: newOutlet.address,
                            outlet_code: outletCode,
                        },
                    },
                });

                return newOutlet;
            });

            return {
                success: true,
                message: 'Outlet created successfully',
                data: outlet,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Outlet code conflict. Please try again.');
                }
            }

            if (error instanceof ConflictException) {
                throw error;
            }

            console.error('[CreateOutletUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create new outlet');
        }
    }
}
