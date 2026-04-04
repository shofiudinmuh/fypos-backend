import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { Role } from '@prisma/client';

jest.setTimeout(60000);

describe('Issue #8: Audit Log & Password Reset (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let ownerToken: string;
    let testTenantId: string;
    let testUserId: string;

    const testEmail = `issue8-${Date.now()}@test.com`;
    const testPassword = 'OldPassword123!';
    const newPassword = 'NewSecurePassword456!';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // 1. Register a fresh tenant
        const regRes = await request(app.getHttpServer())
            .post('/tenants/register')
            .send({
                name: 'Audit Corp',
                ownerEmail: testEmail,
                password: testPassword,
                phone: '081234',
                businessType: 'Services',
            });
        
        ownerToken = regRes.body.access_token;
        testTenantId = regRes.body.tenant_id;
        testUserId = regRes.body.user.id;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Audit Log Pagination (GET /audit-logs)', () => {
        it('should allow OWNER to list audit logs with pagination', async () => {
            // There should be at least one audit log from registration
            const res = await request(app.getHttpServer())
                .get('/audit-logs')
                .set('Authorization', `Bearer ${ownerToken}`)
                .query({ page: 1, limit: 10 })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.total).toBeGreaterThanOrEqual(1);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
            expect(res.body.page).toBe(1);
            expect(res.body.limit).toBe(10);
        });

        it('should filter audit logs by entity', async () => {
            const res = await request(app.getHttpServer())
                .get('/audit-logs')
                .set('Authorization', `Bearer ${ownerToken}`)
                .query({ entity: 'Tenant' })
                .expect(200);

            expect(res.body.data.every((log: any) => log.entity === 'Tenant')).toBe(true);
        });

        it('should forbid non-OWNER from accessing audit logs', async () => {
            // Create a cashier first
            const cashierEmail = `cashier8-${Date.now()}@test.com`;
            await request(app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'Guest User',
                    email: cashierEmail,
                    pin: '1111',
                    role: Role.CASHIER,
                    outlet_id: (await prisma.user.findFirst({ where: { user_id: testUserId } }))!.outlet_id,
                });
            
            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: cashierEmail, pin: '1111' });
            
            const cashierToken = loginRes.body.access_token;

            await request(app.getHttpServer())
                .get('/audit-logs')
                .set('Authorization', `Bearer ${cashierToken}`)
                .expect(403);
        });
    });

    describe('Password Reset Flow', () => {
        let resetToken: string;

        it('should request a password reset token', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: testEmail })
                .expect(200);

            expect(res.body.success).toBe(true);
            
            // Get token from DB since we mock email
            const tokenRecord = await prisma.passwordResetToken.findFirst({
                where: { user_id: testUserId },
                orderBy: { created_at: 'desc' },
            });
            resetToken = tokenRecord!.token;
            expect(resetToken).toBeDefined();
        });

        it('should reset password using a valid token', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({
                    token: resetToken,
                    newPassword: newPassword,
                })
                .expect(200);

            expect(res.body.success).toBe(true);

            // Verify login with new password
            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: testEmail, password: newPassword })
                .expect(200);
            
            expect(loginRes.body.access_token).toBeDefined();

            // Verify Audit Log for password reset
            const auditRes = await request(app.getHttpServer())
                .get('/audit-logs')
                .set('Authorization', `Bearer ${loginRes.body.access_token}`)
                .query({ action: 'PASSWORD_RESET' })
                .expect(200);
            
            expect(auditRes.body.data.some((log: any) => log.action === 'PASSWORD_RESET')).toBe(true);
        });

        it('should reject an already used or invalid token', async () => {
            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({
                    token: resetToken,
                    newPassword: 'AnotherPassword789!',
                })
                .expect(400);
        });
    });
});
