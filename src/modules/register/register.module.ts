import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { CreateRegisterUseCase } from './application/create-register.usecase';
import { GetRegisterUseCase } from './application/get-register.usecase';
import { UpdateRegisterUseCase } from './application/update-register.usecase';
import { DeleteRegisterUseCase } from './application/delete-register.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [RegisterController],
    providers: [
        CreateRegisterUseCase,
        GetRegisterUseCase,
        UpdateRegisterUseCase,
        DeleteRegisterUseCase,
        PrismaService,
    ],
    exports: [
        CreateRegisterUseCase,
        GetRegisterUseCase,
        UpdateRegisterUseCase,
        DeleteRegisterUseCase,
    ],
})
export class RegisterModule {}
