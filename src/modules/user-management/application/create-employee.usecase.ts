import { Injectable, BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class CreateEmployeeUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, authorId: string, dto: CreateEmployeeDto) {
        try {
            // Restriction 1: Cannot create OWNER
            if (dto.role === Role.OWNER) {
                throw new ForbiddenException('Cannot create user with OWNER role');
            }

            // Restriction 2: Email uniqueness
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }

            // Restriction 3: Outlet ownership
            const outlet = await this.prisma.outlet.findFirst({
                where: { outlet_id: dto.outlet_id, tenant_id: tenantId, deleted_at: null },
            });
            if (!outlet) {
                throw new NotFoundException('Target outlet not found or not owned by your tenant');
            }

            const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : null;
            const pinHash = dto.pin ? await bcrypt.hash(dto.pin, 10) : null;

            const newUser = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: dto.outlet_id,
                        name: dto.name,
                        email: dto.email,
                        password_hash: passwordHash,
                        pin: pinHash,
                        role: dto.role,
                        is_active: true,
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: dto.outlet_id,
                        user_id: authorId,
                        action: 'CREATE',
                        entity: 'User',
                        entity_id: user.user_id,
                        new_value: {
                            name: user.name,
                            role: user.role,
                            outlet_id: user.outlet_id,
                        },
                    },
                });

                return user;
            });

            return {
                success: true,
                message: 'Employee account created successfully',
                data: {
                    user_id: newUser.user_id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            };
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            console.error('[CreateEmployeeUseCase]: ', error);
            throw new InternalServerErrorException('Failed to create employee account');
        }
    }
}
