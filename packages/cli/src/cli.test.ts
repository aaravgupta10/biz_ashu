import { describe, it, expect } from 'vitest';
import { runCliAudit } from './cli.js';

const sampleHTML = `
<!DOCTYPE html>
<html>
<body>
  <form>
    <label for="email">Email</label>
    <input type="email" id="email" required />
    <button type="submit">Submit</button>
  </form>
</body>
</html>`;

describe('@platform/cli audit runner', () => {
  it('runs CLI audit on target HTML and evaluates exit code against health score threshold', () => {
    const result = runCliAudit({
      htmlContent: sampleHTML,
      minHealthScore: 50,
    });

    expect(result.healthScore).toBeGreaterThan(0);
    expect(result.exitCode).toBe(0);
    expect(result.reportMarkdown).toContain('Executive CRO Audit Report');
  });
});
