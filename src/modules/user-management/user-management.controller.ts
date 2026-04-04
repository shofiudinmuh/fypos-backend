import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateEmployeeUseCase } from './application/create-employee.usecase';
import { GetEmployeesUseCase } from './application/get-employees.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { DeleteUserUseCase } from './application/delete-user.usecase';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
    constructor(
        private readonly createEmployeeUseCase: CreateEmployeeUseCase,
        private readonly getEmployeesUseCase: GetEmployeesUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) {}

    @Post()
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Register New Employee Account' })
    @ApiResponse({ status: 201, description: 'Employee registered successfully' })
    async create(@CurrentUser() user: any, @Body() dto: CreateEmployeeDto) {
        return this.createEmployeeUseCase.execute(user.tenant_id, user.user_id, dto);
    }

    @Get()
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'List All Employees' })
    @ApiResponse({ status: 200, description: 'Employees list fetched successfully' })
    async findAll(@CurrentUser() user: any) {
        return this.getEmployeesUseCase.execute(user.tenant_id);
    }

    @Patch(':id')
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Update Employee Info' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    async update(
        @CurrentUser() author: any,
        @Param('id') targetUserId: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.updateUserUseCase.execute(author.tenant_id, author.user_id, targetUserId, dto);
    }

    @Delete(':id')
    @Roles('OWNER', 'ADMIN')
    @ApiOperation({ summary: 'Delete (Soft-Delete) Employee Account' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    async delete(@CurrentUser() author: any, @Param('id') targetUserId: string) {
        return this.deleteUserUseCase.execute(author.tenant_id, author.user_id, targetUserId);
    }
}
