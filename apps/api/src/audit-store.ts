import type { CroAuditReport } from '@platform/recommendation';

const reportStore = new Map<string, CroAuditReport>();

/**
 * Saves a CRO Audit Report into the persistent store and generates a public access share token.
 *
 * @param report CroAuditReport object
 * @returns Object containing shareToken and shareUrl path
 */
export function saveSharedAuditReport(report: CroAuditReport): {
  shareToken: string;
  shareUrl: string;
} {
  const shareToken = `share-${Math.random().toString(36).substring(2, 10)}`;
  reportStore.set(shareToken, report);

  return {
    shareToken,
    shareUrl: `/reports/${shareToken}`,
  };
}

/**
 * Retrieves a saved CRO Audit Report by its public share token.
 *
 * @param shareToken Public access token string
 * @returns CroAuditReport or undefined if not found
 */
export function getSharedAuditReport(shareToken: string): CroAuditReport | undefined {
  return reportStore.get(shareToken);
}
