import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { Role } from '@prisma/client';

jest.setTimeout(30000);

describe('Product Category management (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let ownerToken: string;
    let testTenantId: string;
    let testOutletId: string;
    let testProductCategoryId: string;

    const testEmail = `owner-cat-${Date.now()}@test.com`;
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
                name: 'Category Corp',
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
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Product Categories (POST /product-categories)', () => {
        it('should create a new product category', async () => {
            const res = await request(app.getHttpServer())
                .post('/product-categories')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    category_name: 'Beverages',
                    description: 'All kinds of drinks',
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.category_name).toBe('Beverages');
            testProductCategoryId = res.body.data.product_category_id;
        });

        it('should fetch all product categories', async () => {
            const res = await request(app.getHttpServer())
                .get('/product-categories')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.count).toBeGreaterThanOrEqual(1);
        });

        it('should update a product category', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/product-categories/${testProductCategoryId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    category_name: 'Hot Beverages',
                    description: 'Coffee, tea, etc.',
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.category_name).toBe('Hot Beverages');
        });

        it('should delete a product category (soft delete)', async () => {
            await request(app.getHttpServer())
                .delete(`/product-categories/${testProductCategoryId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            // Verify it is not in the list anymore
            const res = await request(app.getHttpServer())
                .get('/product-categories')
                .set('Authorization', `Bearer ${ownerToken}`);
            
            expect(res.body.data.some((c: any) => c.product_category_id === testProductCategoryId)).toBe(false);
        });
    });
});
