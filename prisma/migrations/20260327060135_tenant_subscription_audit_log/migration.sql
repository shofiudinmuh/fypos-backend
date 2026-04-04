/*
  Warnings:

  - The primary key for the `activity_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activityLogId` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `activity_logs` table. All the data in the column will be lost.
  - The primary key for the `api_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apiLogId` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `api_logs` table. All the data in the column will be lost.
  - The primary key for the `audit_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auditLogId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `audit_logs` table. All the data in the column will be lost.
  - The primary key for the `offline_queues` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `offline_queues` table. All the data in the column will be lost.
  - You are about to drop the column `offlineQueueId` on the `offline_queues` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `offline_queues` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `offline_queues` table. All the data in the column will be lost.
  - The primary key for the `outlets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `outletCode` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `outlets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `outlets` table. All the data in the column will be lost.
  - The primary key for the `password_reset_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `permissions` table. All the data in the column will be lost.
  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissionId` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `rolePermissionId` on the `role_permissions` table. All the data in the column will be lost.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `deviceInfo` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - The primary key for the `shift_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endCash` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `shiftLogId` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `startCash` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `shift_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shift_logs` table. All the data in the column will be lost.
  - The primary key for the `subscription_payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `settledAt` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPaymentId` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlanId` on the `subscription_payments` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `subscription_payments` table. All the data in the column will be lost.
  - The primary key for the `subscription_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `billingCycle` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsers` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `priceMonthly` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `priceYearly` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlanId` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `subscription_plans` table. All the data in the column will be lost.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessType` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `gracePeriodEndAt` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `ownerEmail` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEndAt` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlanId` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `trialEndAt` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tenants` table. All the data in the column will be lost.
  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tokens` table. All the data in the column will be lost.
  - The primary key for the `user_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deletedAt` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `grantedAt` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `grantedBy` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `userPermissionId` on the `user_permissions` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outlet_code]` on the table `outlets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `subscription_payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_email]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - The required column `activity_log_id` was added to the `activity_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `outlet_id` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - The required column `api_log_id` was added to the `api_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `outlet_id` to the `api_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_code` to the `api_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `api_logs` table without a default value. This is not possible if the table is not empty.
  - The required column `audit_log_id` was added to the `audit_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `entity_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - The required column `offline_queue_id` was added to the `offline_queues` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `outlet_id` to the `offline_queues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `offline_queues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_code` to the `outlets` table without a default value. This is not possible if the table is not empty.
  - The required column `outlet_id` was added to the `outlets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `tenant_id` to the `outlets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - The required column `reset_token_id` was added to the `password_reset_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - The required column `permission_id` was added to the `permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `permission_id` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - The required column `role_permission_id` was added to the `role_permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `device_info` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_active` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - The required column `session_id` was added to the `sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_cash` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outlet_id` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - The required column `shift_log_id` was added to the `shift_logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `start_cash` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `shift_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `subscription_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_type` to the `subscription_payments` table without a default value. This is not possible if the table is not empty.
  - The required column `subscription_payment_id` was added to the `subscription_payments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `subscription_plan_id` to the `subscription_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `subscription_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_cycle` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_monthly` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_yearly` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - The required column `subscription_plan_id` was added to the `subscription_plans` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `owner_email` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_status` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - The required column `tenant_id` was added to the `tenants` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `trial_end_at` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revoked_at` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - The required column `token_id` was added to the `tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `user_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `user_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_permissions` table without a default value. This is not possible if the table is not empty.
  - The required column `user_permission_id` was added to the `user_permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `outlet_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_outletId_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "api_logs" DROP CONSTRAINT "api_logs_outletId_fkey";

-- DropForeignKey
ALTER TABLE "api_logs" DROP CONSTRAINT "api_logs_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_outletId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "offline_queues" DROP CONSTRAINT "offline_queues_outletId_fkey";

-- DropForeignKey
ALTER TABLE "offline_queues" DROP CONSTRAINT "offline_queues_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "outlets" DROP CONSTRAINT "outlets_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "shift_logs" DROP CONSTRAINT "shift_logs_outletId_fkey";

-- DropForeignKey
ALTER TABLE "shift_logs" DROP CONSTRAINT "shift_logs_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "shift_logs" DROP CONSTRAINT "shift_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscription_payments" DROP CONSTRAINT "subscription_payments_subscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "subscription_payments" DROP CONSTRAINT "subscription_payments_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_subscriptionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_outletId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenantId_fkey";

-- DropIndex
DROP INDEX "activity_logs_tenantId_createdAt_idx";

-- DropIndex
DROP INDEX "api_logs_tenantId_createdAt_idx";

-- DropIndex
DROP INDEX "audit_logs_tenantId_createdAt_idx";

-- DropIndex
DROP INDEX "offline_queues_tenantId_status_idx";

-- DropIndex
DROP INDEX "outlets_outletCode_key";

-- DropIndex
DROP INDEX "outlets_tenantId_idx";

-- DropIndex
DROP INDEX "shift_logs_tenantId_outletId_idx";

-- DropIndex
DROP INDEX "subscription_payments_orderId_key";

-- DropIndex
DROP INDEX "tenants_ownerEmail_key";

-- DropIndex
DROP INDEX "user_permissions_tenantId_idx";

-- DropIndex
DROP INDEX "users_tenantId_idx";

-- AlterTable
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_pkey",
DROP COLUMN "activityLogId",
DROP COLUMN "createdAt",
DROP COLUMN "outletId",
DROP COLUMN "tenantId",
DROP COLUMN "userId",
ADD COLUMN     "activity_log_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("activity_log_id");

-- AlterTable
ALTER TABLE "api_logs" DROP CONSTRAINT "api_logs_pkey",
DROP COLUMN "apiLogId",
DROP COLUMN "createdAt",
DROP COLUMN "outletId",
DROP COLUMN "statusCode",
DROP COLUMN "tenantId",
ADD COLUMN     "api_log_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "status_code" INTEGER NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD CONSTRAINT "api_logs_pkey" PRIMARY KEY ("api_log_id");

-- AlterTable
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_pkey",
DROP COLUMN "auditLogId",
DROP COLUMN "createdAt",
DROP COLUMN "entityId",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
DROP COLUMN "outletId",
DROP COLUMN "tenantId",
DROP COLUMN "userId",
ADD COLUMN     "audit_log_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "new_value" JSONB,
ADD COLUMN     "old_value" JSONB,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("audit_log_id");

-- AlterTable
ALTER TABLE "offline_queues" DROP CONSTRAINT "offline_queues_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "offlineQueueId",
DROP COLUMN "outletId",
DROP COLUMN "tenantId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "offline_queue_id" TEXT NOT NULL,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD CONSTRAINT "offline_queues_pkey" PRIMARY KEY ("offline_queue_id");

-- AlterTable
ALTER TABLE "outlets" DROP CONSTRAINT "outlets_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "outletCode",
DROP COLUMN "outletId",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "outlet_code" TEXT NOT NULL,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "outlets_pkey" PRIMARY KEY ("outlet_id");

-- AlterTable
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "resetTokenId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reset_token_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("reset_token_id");

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "permissionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "permission_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id");

-- AlterTable
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_pkey",
DROP COLUMN "permissionId",
DROP COLUMN "rolePermissionId",
ADD COLUMN     "permission_id" TEXT NOT NULL,
ADD COLUMN     "role_permission_id" TEXT NOT NULL,
ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_permission_id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "deviceInfo",
DROP COLUMN "expiresAt",
DROP COLUMN "isActive",
DROP COLUMN "sessionId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "device_info" TEXT NOT NULL,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id");

-- AlterTable
ALTER TABLE "shift_logs" DROP CONSTRAINT "shift_logs_pkey",
DROP COLUMN "endCash",
DROP COLUMN "endTime",
DROP COLUMN "outletId",
DROP COLUMN "shiftLogId",
DROP COLUMN "startCash",
DROP COLUMN "startTime",
DROP COLUMN "tenantId",
DROP COLUMN "userId",
ADD COLUMN     "end_cash" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "shift_log_id" TEXT NOT NULL,
ADD COLUMN     "start_cash" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "shift_logs_pkey" PRIMARY KEY ("shift_log_id");

-- AlterTable
ALTER TABLE "subscription_payments" DROP CONSTRAINT "subscription_payments_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "orderId",
DROP COLUMN "paymentType",
DROP COLUMN "settledAt",
DROP COLUMN "subscriptionPaymentId",
DROP COLUMN "subscriptionPlanId",
DROP COLUMN "tenantId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "payment_type" TEXT NOT NULL,
ADD COLUMN     "settled_at" TIMESTAMP(3),
ADD COLUMN     "subscription_payment_id" TEXT NOT NULL,
ADD COLUMN     "subscription_plan_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("subscription_payment_id");

-- AlterTable
ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_pkey",
DROP COLUMN "billingCycle",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "maxUsers",
DROP COLUMN "priceMonthly",
DROP COLUMN "priceYearly",
DROP COLUMN "subscriptionPlanId",
DROP COLUMN "updatedAt",
ADD COLUMN     "billing_cycle" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "max_users" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "price_monthly" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price_yearly" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subscription_plan_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("subscription_plan_id");

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
DROP COLUMN "businessType",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "gracePeriodEndAt",
DROP COLUMN "ownerEmail",
DROP COLUMN "subscriptionEndAt",
DROP COLUMN "subscriptionPlanId",
DROP COLUMN "subscriptionStatus",
DROP COLUMN "tenantId",
DROP COLUMN "trialEndAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "business_type" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "grace_period_end_at" TIMESTAMP(3),
ADD COLUMN     "owner_email" TEXT NOT NULL,
ADD COLUMN     "subscription_end_at" TIMESTAMP(3),
ADD COLUMN     "subscription_plan_id" TEXT,
ADD COLUMN     "subscription_status" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "trial_end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id");

-- AlterTable
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "revokedAt",
DROP COLUMN "sessionId",
DROP COLUMN "tokenId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "revoked_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "token_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("token_id");

-- AlterTable
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_pkey",
DROP COLUMN "deletedAt",
DROP COLUMN "grantedAt",
DROP COLUMN "grantedBy",
DROP COLUMN "permissionId",
DROP COLUMN "tenantId",
DROP COLUMN "userId",
DROP COLUMN "userPermissionId",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "granted_by" TEXT,
ADD COLUMN     "permission_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "user_permission_id" TEXT NOT NULL,
ADD CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_permission_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "outletId",
DROP COLUMN "passwordHash",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "outlet_id" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_tenant_id_outlet_id_created_at_idx" ON "activity_logs"("tenant_id", "outlet_id", "created_at");

-- CreateIndex
CREATE INDEX "api_logs_tenant_id_outlet_id_created_at_idx" ON "api_logs"("tenant_id", "outlet_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_tenant_id_outlet_id_created_at_idx" ON "audit_logs"("tenant_id", "outlet_id", "created_at");

-- CreateIndex
CREATE INDEX "offline_queues_tenant_id_outlet_id_status_idx" ON "offline_queues"("tenant_id", "outlet_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "outlets_outlet_code_key" ON "outlets"("outlet_code");

-- CreateIndex
CREATE INDEX "outlets_tenant_id_idx" ON "outlets"("tenant_id");

-- CreateIndex
CREATE INDEX "shift_logs_tenant_id_outlet_id_idx" ON "shift_logs"("tenant_id", "outlet_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_order_id_key" ON "subscription_payments"("order_id");

-- CreateIndex
CREATE INDEX "subscription_payments_tenant_id_idx" ON "subscription_payments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_owner_email_key" ON "tenants"("owner_email");

-- CreateIndex
CREATE INDEX "user_permissions_tenant_id_idx" ON "user_permissions"("tenant_id");

-- CreateIndex
CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("subscription_plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("subscription_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_logs" ADD CONSTRAINT "api_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_logs" ADD CONSTRAINT "api_logs_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queues" ADD CONSTRAINT "offline_queues_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queues" ADD CONSTRAINT "offline_queues_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
