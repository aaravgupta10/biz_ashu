import { describe, it, expect } from 'vitest';
import { compileSiteGraph } from '@platform/compiler';
import { ImmutablePersona } from '@platform/core';
import { runMultiPageSimulationSession } from '@platform/runtime';

const homeHTML = `
<!DOCTYPE html>
<html lang="en">
<head><title>Home</title></head>
<body>
  <header><h1>Store Homepage</h1></header>
  <main><a href="/product">Explore Products</a></main>
</body>
</html>`;

const productHTML = `
<!DOCTYPE html>
<html lang="en">
<head><title>Product</title></head>
<body>
  <header><h1>Awesome Widget</h1></header>
  <main><a href="/checkout">Buy Now</a></main>
</body>
</html>`;

const checkoutHTML = `
<!DOCTYPE html>
<html lang="en">
<head><title>Checkout</title></head>
<body>
  <header><h1>Checkout Page</h1></header>
  <main>
    <form action="/order-confirmation" method="POST">
      <input type="email" name="email" required />
      <button type="submit">Place Order</button>
    </form>
  </main>
</body>
</html>`;

describe('Multi-Page E2E Pipeline Integration Test', () => {
  it('executes multi-page user journey funnel simulation end-to-end', () => {
    const { site, affordancesByRoute } = compileSiteGraph('E-Commerce Funnel', '/', [
      { route: '/', html: homeHTML, name: 'Home' },
      { route: '/product', html: productHTML, name: 'Product' },
      { route: '/checkout', html: checkoutHTML, name: 'Checkout' },
    ]);

    expect(site.entryRoute).toBe('/');
    expect(Object.keys(site.pages).length).toBe(3);

    const persona = ImmutablePersona.create({
      id: 'persona-funnel',
      name: 'High-Intent Buyer',
      role: 'Shopper',
      personality: {
        openness: 0.7,
        conscientiousness: 0.8,
        extraversion: 0.5,
        agreeableness: 0.6,
        neuroticism: 0.2,
      },
      cognitiveTraits: {
        technicalFluency: 0.8,
        domainFamiliarity: 0.8,
        patienceThreshold: 0.6,
        attentionSpan: 0.7,
        visualAcuity: 0.85,
        riskTolerance: 0.7,
      },
      demographics: {},
      metadata: {},
    });

    const trace = runMultiPageSimulationSession({
      site,
      persona,
      affordancesByRoute,
      maxTotalSteps: 20,
      goalRoute: '/checkout',
    });

    expect(trace.simulationId).toBeDefined();
    expect(trace.visitedRoutes.length).toBeGreaterThanOrEqual(1);
    expect(trace.totalSteps).toBeGreaterThan(0);
  });
});
