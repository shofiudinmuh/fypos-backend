import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { REDIS_CLIENT } from '../src/infrastructure/database/redis.provider';

jest.setTimeout(30000);

describe('Product, Variant, and Ingredient management (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let ownerToken: string;
    let testTenantId: string;
    let testOutletId: string;
    let testProductCategoryId: string;
    let testProductId: string;
    let testProductVariantId: string;
    let testIngredientId: string;
    let testProductIngredientId: string;

    const testEmail = `owner-prod-${Date.now()}@test.com`;
    const testPassword = 'Password123!';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // E2E tests shouldn't require a live Redis instance.
            // Override the REDIS_CLIENT provider so module init doesn't attempt to connect.
            .overrideProvider(REDIS_CLIENT)
            .useValue({
                on: jest.fn(),
                connect: jest.fn(),
                disconnect: jest.fn(),
                quit: jest.fn(),
                get: jest.fn(),
                set: jest.fn(),
                del: jest.fn(),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // 1. Register Owner
        const regRes = await request(app.getHttpServer()).post('/tenants/register').send({
            name: 'Product Corp',
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

        // Create a base product category to link to
        const catRes = await request(app.getHttpServer())
            .post('/product-categories')
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({
                category_name: 'Main Category',
                description: 'Used for product testing',
            });

        if (!catRes.body.data) {
            console.error('Setup failed: ', catRes.body);
        }
        testProductCategoryId = catRes.body.data?.product_category_id || 'uninitialized';
    });

    afterAll(async () => {
        await app.close();
    });

    describe('1. Product Module', () => {
        it('should create a new product', async () => {
            const buf = Buffer.from('fake image content');
            const res = await request(app.getHttpServer())
                .post('/products')
                .set('Authorization', `Bearer ${ownerToken}`)
                .field('product_category_id', testProductCategoryId)
                .field('name', 'Test Product')
                .field('sku', 'SKU-001')
                .field('description', 'Test Description')
                .field('price', 15000)
                .attach('image', buf, 'test.png');

            if (res.status !== 201) {
                console.error('Product Creation Error:', res.body);
            }
            expect(res.status).toBe(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Test Product');
            expect(res.body.data.image_url).toBeDefined();
            expect(res.body.data.image_url).toContain('/uploads/products/');
            testProductId = res.body.data.product_id;
        });

        it('should fetch all products', async () => {
            const res = await request(app.getHttpServer())
                .get('/products')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });

        it('should update a product', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/products/${testProductId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .field('name', 'Updated Test Product')
                .field('price', 20000)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Updated Test Product');
            // Check if price was updated, Note Prisma Decimal serialization could make it a string in assertion
            expect(Number(res.body.data.price)).toBe(20000);
        });
    });

    describe('2. Product Variant Module', () => {
        it('should create a product variant', async () => {
            const res = await request(app.getHttpServer())
                .post('/product-variants')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    product_id: testProductId,
                    variant_name: 'Large',
                    description: 'Large size 500ml',
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.variant_name).toBe('Large');
            testProductVariantId = res.body.data.product_variant_id;
        });

        it('should fetch product variants', async () => {
            const res = await request(app.getHttpServer())
                .get(`/product-variants?product_id=${testProductId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
            expect(res.body.data[0].variant_name).toBe('Large');
        });

        it('should update a product variant', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/product-variants/${testProductVariantId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    variant_name: 'Extra Large',
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.variant_name).toBe('Extra Large');
        });
    });

    describe('3. Ingredient Module', () => {
        it('should create a new ingredient', async () => {
            const res = await request(app.getHttpServer())
                .post('/ingredients')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    ingredient_name: 'Sugar',
                    unit: 'kg',
                    minimum_stock: 5,
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.ingredient_name).toBe('Sugar');
            expect(res.body.data.unit).toBe('kg');
            testIngredientId = res.body.data.ingredient_id;
        });

        it('should fetch ingredients', async () => {
            const res = await request(app.getHttpServer())
                .get('/ingredients')
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });

        it('should fetch ingredient by id', async () => {
            const res = await request(app.getHttpServer())
                .get(`/ingredients/${testIngredientId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.ingredient_id).toBe(testIngredientId);
        });

        it('should update an ingredient', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/ingredients/${testIngredientId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    ingredient_name: 'Brown Sugar',
                    unit: 'kg',
                    minimum_stock: 10,
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.ingredient_name).toBe('Brown Sugar');
            expect(res.body.data.minimum_stock).toBe(10);
        });
    });

    describe('4. Product Ingredient Module', () => {
        it('should create a product ingredient', async () => {
            const res = await request(app.getHttpServer())
                .post('/product-ingredients')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    product_id: testProductId,
                    ingredient_id: testIngredientId,
                    qty: 5,
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.qty).toBe(5);
            // Note: current implementation uses `ingredient_id` as identifier for update/delete routes.
            testProductIngredientId = res.body.data.product_ingredient_id;
        });

        it('should fetch product ingredients', async () => {
            const res = await request(app.getHttpServer())
                .get(`/product-ingredients?product_id=${testProductId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });

        it('should update a product ingredient', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/product-ingredients/${testProductIngredientId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    qty: 10,
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.qty).toBe(10);
        });
    });

    describe('5. Deletions (Cascading or Manual)', () => {
        it('should soft delete product ingredient', async () => {
            await request(app.getHttpServer())
                .delete(`/product-ingredients/${testProductIngredientId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
        });

        it('should soft delete product variant', async () => {
            await request(app.getHttpServer())
                .delete(`/product-variants/${testProductVariantId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
        });

        it('should soft delete ingredient', async () => {
            await request(app.getHttpServer())
                .delete(`/ingredients/${testIngredientId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
        });

        it('should soft delete product', async () => {
            await request(app.getHttpServer())
                .delete(`/products/${testProductId}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
        });
    });
});
