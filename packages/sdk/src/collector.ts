export interface SdkConfig {
  projectId: string;
  apiEndpoint?: string;
}

export interface DomSnapshotPayload {
  projectId: string;
  url: string;
  htmlContent: string;
  timestamp: string;
}

/**
 * Captures a client-side DOM snapshot payload for transmission to the Behavioral Intelligence Platform API.
 *
 * @param config SdkConfig
 * @param rawHtml Target page HTML document content
 * @param currentUrl Current page location URL
 * @returns DomSnapshotPayload ready for HTTP delivery
 */
export function captureDomSnapshot(
  config: SdkConfig,
  rawHtml: string,
  currentUrl: string,
): DomSnapshotPayload {
  return {
    projectId: config.projectId,
    url: currentUrl,
    htmlContent: rawHtml,
    timestamp: new Date().toISOString(),
  };
}
