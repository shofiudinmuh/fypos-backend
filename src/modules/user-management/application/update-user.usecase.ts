import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(tenantId: string, authorId: string, targetUserId: string, dto: UpdateUserDto) {
        try {
            // 1. Fetch target user
            const targetUser = await this.prisma.user.findFirst({
                where: { user_id: targetUserId, tenant_id: tenantId, deleted_at: null },
            });

            if (!targetUser) {
                throw new NotFoundException('User not found in your tenant');
            }

            // 2. Security: Cannot promote to OWNER
            if (dto.role === Role.OWNER) {
                throw new ForbiddenException('Cannot promote user to OWNER role');
            }

            // 3. Security: Cannot modify an OWNER via this endpoint (usually)
            if (targetUser.role === Role.OWNER && authorId !== targetUserId) {
                 // Only allow owner to update their own profile via specific tenant profile endpoint, 
                 // or restrict editing other owners if multiple exist (unlikely in this model).
                 throw new ForbiddenException('Cannot modify OWNER account via employee management');
            }

            // 4. Validate Outlet Mutation
            if (dto.outlet_id && dto.outlet_id !== targetUser.outlet_id) {
                const outlet = await this.prisma.outlet.findFirst({
                    where: { outlet_id: dto.outlet_id, tenant_id: tenantId, deleted_at: null },
                });
                if (!outlet) {
                    throw new BadRequestException('Target outlet not found or not owned by your tenant');
                }
            }

            // 5. Prepare Hashes
            const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
            const pinHash = dto.pin ? await bcrypt.hash(dto.pin, 10) : undefined;

            const updatedUser = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.user.update({
                    where: { user_id: targetUserId },
                    data: {
                        name: dto.name,
                        role: dto.role,
                        outlet_id: dto.outlet_id,
                        password_hash: passwordHash,
                        pin: pinHash,
                        updated_at: new Date(),
                    },
                });

                // Audit Log
                await tx.auditLog.create({
                    data: {
                        tenant_id: tenantId,
                        outlet_id: updated.outlet_id,
                        user_id: authorId,
                        action: 'UPDATE',
                        entity: 'User',
                        entity_id: targetUserId,
                        old_value: {
                            name: targetUser.name,
                            role: targetUser.role,
                            outlet_id: targetUser.outlet_id,
                        },
                        new_value: {
                            name: updated.name,
                            role: updated.role,
                            outlet_id: updated.outlet_id,
                        },
                    },
                });

                return updated;
            });

            return {
                success: true,
                message: 'User updated successfully',
                data: {
                    user_id: updatedUser.user_id,
                    name: updatedUser.name,
                    role: updatedUser.role,
                    outlet_id: updatedUser.outlet_id,
                },
            };
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            console.error('[UpdateUserUseCase]: ', error);
            throw new InternalServerErrorException('Failed to update user account');
        }
    }
}
