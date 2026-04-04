export class TenantEntity {
    constructor(
        public readonly tenantId: string,
        public name: string,
        public ownerEmail: string,
        public phone: string,
        public address: string,
        public businessType: string,
        public trialEndAt: Date,
        public subscriptionStatus: 'trial' | 'active' | 'expired' | 'grace',
        public subscriptionPlanId: string,
        public subscriptionEndAt: Date,
        public gracePeriodEndAt: Date,
    ) {}
}
