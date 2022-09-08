import { UuidGenerator } from "../data/datasource/uidGenerator";
import { v4 as uuidv4 } from 'uuid';

export class UuidGeneratorAdapter implements UuidGenerator {
  generate(): string {
    return uuidv4();
  }
  
}