import { BaseEntity } from '../common/index.js';

export interface DigitalTwin extends BaseEntity {
  url: string;
  name: string;
}
