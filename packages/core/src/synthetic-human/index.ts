import { BaseEntity } from '../common/index.js';

export interface SyntheticHuman extends BaseEntity {
  persona: string;
  capabilities: string[];
}
