import { InvalidRecommendationError } from "../../errors/maintenances/InvalidRecommendationError";
import { Value } from "../Value";

export class Recommendation implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): Recommendation | InvalidRecommendationError {
    const normalized = value.trim();
    if (normalized.length < 5 || normalized.length > 500) {
      return new InvalidRecommendationError(normalized);
    }
    return new Recommendation(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
