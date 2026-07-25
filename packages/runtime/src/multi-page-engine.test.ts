import { describe, it, expect } from 'vitest';
import { compileSiteGraph } from '@platform/compiler';
import { ImmutablePersona } from '@platform/core';
import { runMultiPageSimulationSession } from './multi-page-engine.js';

const homeHTML = `
<!DOCTYPE html>
<html>
<body>
  <header><h1>Welcome to Shop</h1></header>
  <main>
    <a href="/product">View Featured Product</a>
  </main>
</body>
</html>`;

const productHTML = `
<!DOCTYPE html>
<html>
<body>
  <header><h1>Featured Product</h1></header>
  <main>
    <a href="/checkout">Proceed to Checkout</a>
  </main>
</body>
</html>`;

const checkoutHTML = `
<!DOCTYPE html>
<html>
<body>
  <header><h1>Order Checkout</h1></header>
  <main>
    <form action="/thank-you" method="POST">
      <input type="email" name="email" required />
      <button type="submit">Pay Now</button>
    </form>
  </main>
</body>
</html>`;

describe('Multi-Page Navigation Journey Simulator', () => {
  it('compiles multi-page site graph and runs cross-page simulation session', () => {
    const compiledSite = compileSiteGraph('E-Commerce Funnel', '/', [
      { route: '/', html: homeHTML, name: 'Home Page' },
      { route: '/product', html: productHTML, name: 'Product Page' },
      { route: '/checkout', html: checkoutHTML, name: 'Checkout Page' },
    ]);

    expect(compiledSite.site.name).toBe('E-Commerce Funnel');
    expect(compiledSite.site.getPageByRoute('/')).toBeDefined();
    expect(compiledSite.site.getPageByRoute('/product')).toBeDefined();
    expect(compiledSite.site.getPageByRoute('/checkout')).toBeDefined();

    const persona = ImmutablePersona.create({
      id: 'persona-multipage',
      name: 'Curious Buyer',
      role: 'Shopper',
      personality: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.7,
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
      site: compiledSite.site,
      persona,
      affordancesByRoute: compiledSite.affordancesByRoute,
      maxTotalSteps: 15,
      goalRoute: '/checkout',
    });

    expect(trace.simulationId).toBeDefined();
    expect(trace.totalSteps).toBeGreaterThan(0);
    expect(trace.visitedRoutes.length).toBeGreaterThanOrEqual(1);
    expect(trace.visitedRoutes[0]).toBe('/');
    expect(Object.isFrozen(trace)).toBe(true);
  });
});
