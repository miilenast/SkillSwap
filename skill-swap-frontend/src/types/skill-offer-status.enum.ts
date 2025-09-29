export const SkillOfferStatus = {
  AVAILABLE: 'dostupan',
  UNAVAILABLE: 'nedostupan',
} as const;

export type SkillOfferStatus = typeof SkillOfferStatus[keyof typeof SkillOfferStatus];