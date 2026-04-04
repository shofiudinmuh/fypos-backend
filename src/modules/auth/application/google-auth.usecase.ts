import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { TenantMapper } from 'src/infrastructure/mappers/tenant.mapper';
import { addDays } from 'src/common/utils/date.utils';

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

            tenant = await this.prisma.tenant.create({
                data: {
                    name: `${payload.name}'s Business`,
                    owner_email: payload.email,
                    trial_end_at: trialEndAt,
                    subscription_status: 'trial',
                },
            });

            // create owner user
            await this.prisma.user.create({
                data: {
                    tenant_id: tenant.tenant_id,
                    outlet_id: '',
                    name: payload.name,
                    email: payload.email,
                    google_id: payload.googleId,
                    role: 'OWNER',
                    is_active: true,
                },
            });
        } else {
            await this.prisma.user.updateMany({
                where: { email: payload.email, tenant_id: tenant.tenant_id },
                data: { google_id: payload.googleId },
            });
        }

        // get user owner
        const user = await this.prisma.user.findFirst({
            where: { email: payload.email, tenant_id: tenant.tenant_id, role: 'OWNER' },
        });

        // generate JWT
        const token = this.jwtService.sign({
            sub: user?.user_id,
            tenant_id: tenant.tenant_id,
            role: user?.role,
        });

        return {
            access_token: token,
            tenant_id: tenant.tenant_id,
            user: {
                id: user?.user_id,
                name: user?.name,
                role: user?.role,
            },
            isNewTenant: !tenant.created_at ? true : false,
        };
    }
}
