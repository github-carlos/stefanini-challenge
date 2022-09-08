import { v4 as uuidv4 } from 'uuid';
import { UuidGenerator } from '../../data/datasource/uidGenerator';

export class UuidGeneratorAdapter implements UuidGenerator {
  generate(): string {
    return uuidv4();
  }
  
}