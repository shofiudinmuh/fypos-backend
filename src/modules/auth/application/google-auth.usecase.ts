import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { addDays } from 'src/common/utils/date.utils';
import { Role } from '@prisma/client';

@Injectable()
export class GoogleAuthUseCase {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async execute(payload: { googleId: string; email: string; name: string }) {
        // check if tenant is exist
        let tenant = await this.prisma.tenant.findUnique({
            where: { owner_email: payload.email, deleted_at: null },
        });

        if (!tenant) {
            // process register new tenant
            const trialEndAt = addDays(new Date(), 30);

            tenant = await this.prisma.$transaction(async (tx) => {
                const newTenant = await tx.tenant.create({
                    data: {
                        name: `${payload.name}'s Business`,
                        owner_email: payload.email,
                        trial_end_at: trialEndAt,
                        subscription_status: 'trial',
                    },
                });

                const defaultOutlet = await tx.outlet.create({
                    data: {
                        tenant_id: newTenant.tenant_id,
                        name: 'Main Outlet',
                        address: 'Address not set',
                        phone: '0000000000',
                        outlet_code: `OUT-MAIN-${newTenant.tenant_id.slice(-4).toUpperCase()}`,
                    },
                });

                // create owner user
                await tx.user.create({
                    data: {
                        tenant_id: newTenant.tenant_id,
                        outlet_id: defaultOutlet.outlet_id,
                        name: payload.name,
                        email: payload.email,
                        google_id: payload.googleId,
                        role: Role.OWNER,
                        is_active: true,
                    },
                });

                return newTenant;
            });
        } else {
            await this.prisma.user.updateMany({
                where: { email: payload.email, tenant_id: tenant!.tenant_id },
                data: { google_id: payload.googleId },
            });
        }

        // get user owner
        const user = await this.prisma.user.findFirst({
            where: { email: payload.email, tenant_id: tenant!.tenant_id, role: Role.OWNER },
        });

        // generate JWT
        const token = this.jwtService.sign({
            sub: user?.user_id,
            tenant_id: tenant!.tenant_id,
            outlet_id: user?.outlet_id,
            role: user?.role,
        });

        return {
            access_token: token,
            tenant_id: tenant!.tenant_id,
            outlet_id: user?.outlet_id,
            user: {
                id: user?.user_id,
                name: user?.name,
                role: user?.role,
            },
            isNewTenant: !tenant!.created_at ? true : false,
        };
    }
}
