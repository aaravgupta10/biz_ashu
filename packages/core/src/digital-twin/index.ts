import { BaseEntity } from '../common/index.js';

export * from './component.js';
export * from './page.js';
export * from './site-graph.js';

export interface DigitalTwin extends BaseEntity {
  url: string;
  name: string;
}
