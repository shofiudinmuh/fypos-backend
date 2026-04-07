import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { CreateIngredientUseCase } from './application/create-ingredient.usecase';
import { GetIngredientUseCase } from './application/get-ingredient.usecase';
import { UpdateIngredientUseCase } from './application/update-ingredient.usecase';
import { DeleteIngredientUseCase } from './application/delete-ingredient.usecase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
    controllers: [IngredientController],
    providers: [
        CreateIngredientUseCase,
        GetIngredientUseCase,
        UpdateIngredientUseCase,
        DeleteIngredientUseCase,
        PrismaService,
    ],
    exports: [
        CreateIngredientUseCase,
        GetIngredientUseCase,
        UpdateIngredientUseCase,
        DeleteIngredientUseCase,
    ],
})
export class IngredientModule {}
