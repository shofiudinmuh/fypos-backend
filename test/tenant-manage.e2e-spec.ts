import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { Role } from '@prisma/client';

jest.setTimeout(30000);

describe('Tenant Management & Outlets (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let ownerToken: string;
    let cashierToken: string;
    let superAdminToken: string;
    let testTenantId: string;
    let testOutletId: string;
    let secondOutletId: string;
    let employeeUserId: string;

    const testEmail = `owner-${Date.now()}@test.com`;
    const testPassword = 'Password123!';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // 1. Register Owner
        const regRes = await request(app.getHttpServer())
            .post('/tenants/register')
            .send({
                name: 'Test Corp',
                ownerEmail: testEmail,
                password: testPassword,
                phone: '08123',
                businessType: 'Retail',
            });
        
        ownerToken = regRes.body.access_token;
        testTenantId = regRes.body.tenant_id;

        // Get default outlet id created during registration
        const ownerProfile = await prisma.user.findFirst({ where: { email: testEmail } });
        testOutletId = ownerProfile!.outlet_id;

        // 2. Setup SuperAdmin for manual registration tests
        const saEmail = `sa-${Date.now()}@fypos.id`;
        const saPassword = 'SuperPassword123!';
        
        // We need an existing tenant/outlet for the SA as well (or at least valid IDs)
        await prisma.user.create({
            data: {
                tenant_id: testTenantId,
                outlet_id: testOutletId,
                name: 'System Super Admin',
                email: saEmail,
                password_hash: await require('bcrypt').hash(saPassword, 10),
                role: Role.SUPERADMIN,
                is_active: true,
            }
        });

        const saLoginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: saEmail, password: saPassword });
        superAdminToken = saLoginRes.body.access_token;

        // 3. Create a subscription plan for manual registration test
        await prisma.subscriptionPlan.upsert({
            where: { subscription_plan_id: 'some-plan-id' },
            update: {},
            create: {
                subscription_plan_id: 'some-plan-id',
                name: 'Enterprise Plan',
                price_monthly: 500000,
                price_yearly: 5000000,
                billing_cycle: 'MONTHLY',
                features: { max_outlets: 10, max_users: 50 },
            }
        });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Tenant Profile (PATCH /tenants/profile)', () => {
        it('should update tenant profile as OWNER', async () => {
            const res = await request(app.getHttpServer())
                .patch('/tenants/profile')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'Updated Corp Name',
                    address: 'New Address 123',
                })
                .expect(200);

            expect(res.body.data.name).toBe('Updated Corp Name');

            // Verify Audit Log
            const audit = await prisma.auditLog.findFirst({
                where: { tenant_id: testTenantId, entity: 'Tenant', action: 'UPDATE' }
            });
            expect(audit).toBeDefined();
        });
    });

    describe('Outlet Management (POST /outlets)', () => {
        it('should create new outlet as OWNER', async () => {
            const res = await request(app.getHttpServer())
                .post('/outlets')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'Secondary Branch',
                    address: 'Street B',
                    phone: '021-999',
                })
                .expect(201);

            expect(res.body.data.name).toBe('Secondary Branch');
            expect(res.body.data.outlet_code).toContain('OUT-');
        });

        it('should fetch all outlets', async () => {
             const res = await request(app.getHttpServer())
                .get('/outlets')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.count).toBeGreaterThanOrEqual(2); // Default + New
        });

        it('should update outlet info', async () => {
            const outlets = await request(app.getHttpServer())
                .get('/outlets')
                .set('Authorization', `Bearer ${ownerToken}`);
            
            secondOutletId = outlets.body.data.find((o: any) => o.name === 'Secondary Branch').outlet_id;

            const res = await request(app.getHttpServer())
                .patch(`/outlets/${secondOutletId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({ name: 'Updated Branch Name' })
                .expect(200);
            
            expect(res.body.data.name).toBe('Updated Branch Name');
        });

        it('should soft-delete outlet', async () => {
            await request(app.getHttpServer())
                .delete(`/outlets/${secondOutletId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
            
            // Verify it is not in the list anymore
            const res = await request(app.getHttpServer())
                .get('/outlets')
                .set('Authorization', `Bearer ${ownerToken}`);
            
            expect(res.body.data.some((o: any) => o.outlet_id === secondOutletId)).toBe(false);
        });
    });

    describe('User Management (POST /users)', () => {
        const cashierEmail = `cashier-${Date.now()}@test.com`;

        it('should create a CASHIER as OWNER', async () => {
            const res = await request(app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'John Cashier',
                    email: cashierEmail,
                    pin: '1234',
                    role: Role.CASHIER,
                    outlet_id: testOutletId,
                })
                .expect(201);

            expect(res.body.data.role).toBe(Role.CASHIER);
            employeeUserId = res.body.data.user_id;

            // Login as Cashier to get token for next tests
            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: cashierEmail, pin: '1234' });
            
            cashierToken = loginRes.body.access_token;
        });

        it('should list all employees', async () => {
            const res = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
            
            expect(res.body.data.some((u: any) => u.email === cashierEmail)).toBe(true);
        });

        it('should forbid CASHIER from updating tenant profile', async () => {
            await request(app.getHttpServer())
                .patch('/tenants/profile')
                .set('Authorization', `Bearer ${cashierToken}`)
                .send({ name: 'Hacked name' })
                .expect(403);
        });

        it('should update employee info', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/users/${employeeUserId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({ name: 'Updated Staff Name', role: Role.ADMIN })
                .expect(200);
            
            expect(res.body.data.name).toBe('Updated Staff Name');
            expect(res.body.data.role).toBe(Role.ADMIN);
        });

        it('should forbid deleting own account (anti-suicide)', async () => {
            // Find owner user ID
            const owner = await prisma.user.findFirst({ where: { email: testEmail } });
            
            await request(app.getHttpServer())
                .delete(`/users/${owner!.user_id}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(403);
        });

        it('should soft-delete employee account', async () => {
            await request(app.getHttpServer())
                .delete(`/users/${employeeUserId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
            
            // Verify it is not in the list
            const res = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${ownerToken}`);
            
            expect(res.body.data.some((u: any) => u.user_id === employeeUserId)).toBe(false);
        });

        it('should forbid creating another OWNER role', async () => {
            await request(app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'Fake Owner',
                    email: 'fake@test.com',
                    password: 'password',
                    role: Role.OWNER,
                    outlet_id: testOutletId,
                })
                .expect(403);
        });
    });

    describe('Manual Registration (POST /admin/tenants/manual)', () => {
        it('should allow SUPERADMIN to register a tenant manually', async () => {
            const res = await request(app.getHttpServer())
                .post('/admin/tenants/manual')
                .set('Authorization', `Bearer ${superAdminToken}`)
                .send({
                    name: 'B2B Enterprise',
                    ownerEmail: `b2b-${Date.now()}@enterprise.com`,
                    direct_activate: true,
                    subscription_plan_id: 'some-plan-id',
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.raw_password).toBeDefined();
        });

        it('should deny OWNER from registering a tenant manually', async () => {
            await request(app.getHttpServer())
                .post('/admin/tenants/manual')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    name: 'Illegal Entry',
                    ownerEmail: 'hacker@tenant.com',
                })
                .expect(403);
        });
    });

    describe('Tenant Offboarding (DELETE /tenants)', () => {
        it('should allow OWNER to close tenant account (Soft Delete)', async () => {
            await request(app.getHttpServer())
                .delete('/tenants')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
            
            // Try to login again should fail or at least the user should be inactive
            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: testEmail, password: testPassword });
            
            // Login fails because user is deactivated
            expect(loginRes.status).toBe(401);
        });
    });
});
