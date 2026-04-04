import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ERROR_MESSAGES } from '../src/common/constants/error-messages.constants';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Auth & Tenant (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    const testEmail = `test-user-${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    describe('/tenants/register (POST)', () => {
        it('should register a new tenant and create default outlet', async () => {
            const response = await request(app.getHttpServer())
                .post('/tenants/register')
                .send({
                    name: 'Test Tenant',
                    ownerEmail: testEmail,
                    password: testPassword,
                    phone: '08123456789',
                    address: 'Test Address',
                    businessType: 'Retail',
                })
                .expect(201);

            expect(response.body).toHaveProperty('access_token');
            expect(response.body).toHaveProperty('tenant_id');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.role).toBe('OWNER');
            expect(response.body.isNewTenant).toBe(true);

            // Audit Log Check
            const auditLog = await prisma.auditLog.findFirst({
                where: {
                    tenant_id: response.body.tenant_id,
                    action: 'CREATE',
                    entity: 'Tenant',
                },
            });
            expect(auditLog).toBeDefined();
            expect(auditLog?.user_id).toBe(response.body.user.id);
        });

        it('should fail to register with same email (Conflict)', async () => {
             const response = await request(app.getHttpServer())
                .post('/tenants/register')
                .send({
                    name: 'Test Tenant 2',
                    ownerEmail: testEmail,
                    password: testPassword,
                })
                .expect(409);
            
            expect(response.body.message).toBe(ERROR_MESSAGES.TENANT.ALREADY_REGISTERED);
        });
    });

    describe('/auth/login (POST)', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword,
                })
                .expect(200);

            expect(response.body).toHaveProperty('access_token');
            expect(response.body.user.email).toBe(testEmail);
            expect(response.body.user.role).toBe('OWNER');

            // Session & Activity Log Check
            const session = await prisma.session.findFirst({
                where: { user_id: response.body.user.user_id, is_active: true },
            });
            expect(session).toBeDefined();

            const activityLog = await prisma.activityLog.findFirst({
                where: {
                    user_id: response.body.user.user_id,
                    action: 'USER_LOGIN',
                },
            });
            expect(activityLog).toBeDefined();
        });

        it('should fail with wrong password', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: 'wrongpassword',
                })
                .expect(401);

            expect(response.body.message).toBe(ERROR_MESSAGES.AUTH.WRONG_PASSWORD);
        });

        it('should fail with invalid email format (Validation)', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'invalid-email',
                    password: testPassword,
                })
                .expect(400);
        });
    });
});
