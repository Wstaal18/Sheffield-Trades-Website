/**
 * Settings used by the Privacy & Cookies page (/privacy/).
 * ⚠️ The club should check these reflect what actually happens in practice,
 * especially the retention periods, then update `lastUpdated`.
 */
export const privacy = {
  lastUpdated: '10 November 2026',

  /** How long booking requests that don't go ahead are kept */
  retentionDeclined: '6 months',
  /** How long details of confirmed bookings are kept */
  retentionConfirmed: '2 years after the event',
  /** How long general emails / messages are kept */
  retentionMessages: '2 years',
};
