import { describe, it, expect } from 'vitest';
import { ImmutablePage } from '@platform/core';
import type { InteractionAffordance } from './interaction-affordance.js';
import { validateDigitalTwinPage } from './twin-validator.js';

describe('twin-validator', () => {
  it('passes validation for a valid Page and component graph', () => {
    const page = ImmutablePage.create({
      id: 'page-1',
      name: 'Home Page',
      route: '/home',
      purpose: 'Landing page',
      components: [
        {
          id: 'comp-1',
          name: 'Headline',
          type: 'Headline',
          purpose: 'Main Title',
          metadata: { childComponentIds: ['comp-2'] },
        },
        {
          id: 'comp-2',
          name: 'CTA',
          type: 'CTA',
          purpose: 'Submit Form',
          metadata: { parentComponentId: 'comp-1' },
        },
      ],
      metadata: {},
    });

    const affordances: InteractionAffordance[] = [
      {
        id: 'aff-1',
        type: 'click',
        targetNodeId: 'comp-2',
        description: 'Click submit button',
        enabled: true,
        metadata: {},
      },
    ];

    const result = validateDigitalTwinPage(page, affordances);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects page-level validation errors', () => {
    const invalidPage = ImmutablePage.create({
      id: '   ',
      name: '  ',
      route: 'invalid-route-no-slash',
      purpose: '   ',
      components: [],
      metadata: {},
    });

    const result = validateDigitalTwinPage(invalidPage);
    expect(result.valid).toBe(false);
    const errorCodes = result.errors.map((e) => e.code);
    expect(errorCodes).toContain('EMPTY_PAGE_ID');
    expect(errorCodes).toContain('EMPTY_PAGE_NAME');
    expect(errorCodes).toContain('INVALID_PAGE_ROUTE');
    expect(errorCodes).toContain('EMPTY_PAGE_PURPOSE');
    expect(errorCodes).toContain('EMPTY_COMPONENTS_LIST');
  });

  it('detects duplicate component IDs', () => {
    const pageWithDuplicates = ImmutablePage.create({
      id: 'page-1',
      name: 'Home',
      route: '/',
      purpose: 'Home',
      components: [
        { id: 'dup-1', name: 'Comp 1', type: 'CTA', purpose: 'Click', metadata: {} },
        { id: 'dup-1', name: 'Comp 2', type: 'Link', purpose: 'Navigate', metadata: {} },
      ],
      metadata: {},
    });

    const result = validateDigitalTwinPage(pageWithDuplicates);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'DUPLICATE_COMPONENT_ID')).toBe(true);
  });

  it('detects dangling parent and child references', () => {
    const pageWithDanglingRefs = ImmutablePage.create({
      id: 'page-1',
      name: 'Home',
      route: '/',
      purpose: 'Home',
      components: [
        {
          id: 'comp-1',
          name: 'Container',
          type: 'Section',
          purpose: 'Section container',
          metadata: {
            parentComponentId: 'non-existent-parent',
            childComponentIds: ['non-existent-child'],
          },
        },
      ],
      metadata: {},
    });

    const result = validateDigitalTwinPage(pageWithDanglingRefs);
    expect(result.valid).toBe(false);
    const codes = result.errors.map((e) => e.code);
    expect(codes).toContain('DANGLING_PARENT_REFERENCE');
    expect(codes).toContain('DANGLING_CHILD_REFERENCE');
  });

  it('detects invalid affordance target component IDs', () => {
    const page = ImmutablePage.create({
      id: 'page-1',
      name: 'Home',
      route: '/',
      purpose: 'Home',
      components: [
        { id: 'comp-1', name: 'Headline', type: 'Headline', purpose: 'Title', metadata: {} },
      ],
      metadata: {},
    });

    const invalidAffordance: InteractionAffordance = {
      id: 'aff-1',
      type: 'click',
      targetNodeId: 'missing-component-id',
      description: 'Click button',
      enabled: true,
      metadata: {},
    };

    const result = validateDigitalTwinPage(page, [invalidAffordance]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_AFFORDANCE_TARGET')).toBe(true);
  });
});
