import { Part } from "../../../domain/entities/Part";

export interface IPartRepository {
  createPart(part: Part): Promise<Part>;
  updatePart(part: Part): Promise<Part | null>;
  deletePart(id: string): Promise<void>;
  getPartById(id: string): Promise<Part | null>;
  getPartByReference(reference: string): Promise<Part | null>;
  listParts(): Promise<Part[]>;
  getPartTypeById(id: string): Promise<string | null>;
}
