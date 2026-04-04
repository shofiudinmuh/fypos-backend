import { Module } from '@nestjs/common';
import { OutletController } from './outlet.controller';
import { CreateOutletUseCase } from './application/create-outlet.usecase';
import { GetOutletsUseCase } from './application/get-outlets.usecase';
import { UpdateOutletUseCase } from './application/update-outlet.usecase';
import { DeleteOutletUseCase } from './application/delete-outlet.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [OutletController],
    providers: [CreateOutletUseCase, GetOutletsUseCase, UpdateOutletUseCase, DeleteOutletUseCase, PrismaService],
    exports: [CreateOutletUseCase, GetOutletsUseCase, UpdateOutletUseCase, DeleteOutletUseCase],
})
export class OutletModule {}
