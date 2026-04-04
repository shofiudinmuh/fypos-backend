import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { CreateEmployeeUseCase } from './application/create-employee.usecase';
import { GetEmployeesUseCase } from './application/get-employees.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [UserManagementController],
    providers: [CreateEmployeeUseCase, GetEmployeesUseCase, UpdateUserUseCase, DeleteUserUseCase, PrismaService],
    exports: [CreateEmployeeUseCase, GetEmployeesUseCase, UpdateUserUseCase, DeleteUserUseCase],
})
export class UserManagementModule {}
