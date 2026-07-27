export interface SampleTemplate {
  id: string;
  name: string;
  category: 'saas' | 'ecommerce' | 'leadgen';
  description: string;
  htmlContent: string;
}

export const SAAS_PRICING_TEMPLATE: SampleTemplate = {
  id: 'saas-pricing',
  name: 'SaaS B2B Pricing Matrix',
  category: 'saas',
  description:
    'Multi-tier SaaS pricing table featuring Starter ($29), Pro ($99), and Enterprise plans.',
  htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SaaS Pricing Matrix</title>
  <style>
    body { font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 2rem; }
    .pricing-grid { display: flex; gap: 1.5rem; justify-content: center; }
    .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 0.75rem; padding: 2rem; width: 280px; text-align: center; }
    .card.featured { border-color: #0284c7; box-shadow: 0 0 15px rgba(2, 132, 199, 0.4); }
    .btn { background-color: #0284c7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; width: 100%; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <h1 style="text-align: center;">Choose Your Scale Plan</h1>
  <div class="pricing-grid">
    <div class="card">
      <h2>Starter</h2>
      <p style="font-size: 2rem; font-weight: bold;">$29/mo</p>
      <p>Ideal for solo developers.</p>
      <button class="btn" id="btn-starter">Select Starter</button>
    </div>
    <div class="card featured">
      <span style="background: #0284c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">POPULAR</span>
      <h2>Pro Team</h2>
      <p style="font-size: 2rem; font-weight: bold;">$99/mo</p>
      <p>For growing engineering teams.</p>
      <button class="btn" id="btn-pro">Start 14-Day Free Trial</button>
    </div>
    <div class="card">
      <h2>Enterprise</h2>
      <p style="font-size: 2rem; font-weight: bold;">Custom</p>
      <p>Dedicated SOC2 compliance & SLA.</p>
      <button class="btn" id="btn-enterprise" style="background: #334155;">Contact Sales</button>
    </div>
  </div>
</body>
</html>`,
};

export const CHECKOUT_TEMPLATE: SampleTemplate = {
  id: 'ecommerce-checkout',
  name: 'E-Commerce 3-Step Checkout',
  category: 'ecommerce',
  description:
    'Shopify-style multi-step checkout form with email, card details, and shipping address.',
  htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Express Checkout</title>
  <style>
    body { font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 2rem; max-width: 500px; margin: 0 auto; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #94a3b8; }
    input { width: 100%; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #334155; background: #1e293b; color: white; box-sizing: border-box; }
    .btn-pay { width: 100%; padding: 1rem; background-color: #10b981; color: white; font-weight: bold; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; }
  </style>
</head>
<body>
  <h2>Secure Express Checkout</h2>
  <form id="checkout-form">
    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" placeholder="alex@company.com" required />
    </div>
    <div class="form-group">
      <label for="card">Credit Card Number</label>
      <input type="text" id="card" placeholder="4532 •••• •••• 8892" required />
    </div>
    <div class="form-group">
      <label for="address">Shipping Address</label>
      <input type="text" id="address" placeholder="123 Tech Blvd, San Francisco, CA" required />
    </div>
    <button type="submit" class="btn-pay" id="btn-submit-order">Complete Purchase ($149.00)</button>
  </form>
</body>
</html>`,
};

export const LEAD_GEN_TEMPLATE: SampleTemplate = {
  id: 'b2b-leadgen',
  name: 'B2B Demo Request Form',
  category: 'leadgen',
  description: 'HubSpot-style B2B lead generation form for scheduling product demos.',
  htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Request Product Demo</title>
  <style>
    body { font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 2rem; max-width: 450px; margin: 0 auto; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.375rem; font-size: 0.875rem; color: #cbd5e1; }
    input, select { width: 100%; padding: 0.625rem; border-radius: 0.375rem; border: 1px solid #334155; background: #1e293b; color: white; box-sizing: border-box; }
    .btn-demo { width: 100%; padding: 0.875rem; background-color: #0284c7; color: white; font-weight: bold; border: none; border-radius: 0.375rem; cursor: pointer; margin-top: 1rem; }
  </style>
</head>
<body>
  <h2>Request a Live Platform Demo</h2>
  <form id="demo-form">
    <div class="form-group">
      <label for="full-name">Full Name</label>
      <input type="text" id="full-name" placeholder="Sarah Jenkins" required />
    </div>
    <div class="form-group">
      <label for="work-email">Work Email</label>
      <input type="email" id="work-email" placeholder="sarah@enterprise.com" required />
    </div>
    <div class="form-group">
      <label for="company-size">Company Size</label>
      <select id="company-size">
        <option value="1-50">1-50 Employees</option>
        <option value="51-200">51-200 Employees</option>
        <option value="201-1000">201-1000 Employees</option>
        <option value="1000+">1000+ Employees</option>
      </select>
    </div>
    <button type="submit" class="btn-demo" id="btn-request-demo">Schedule My Live Demo</button>
  </form>
</body>
</html>`,
};

export const SAMPLE_TEMPLATES: SampleTemplate[] = [
  SAAS_PRICING_TEMPLATE,
  CHECKOUT_TEMPLATE,
  LEAD_GEN_TEMPLATE,
];
