import { PartType } from "../values/parts/PartType";
import { PartReference } from "../values/parts/PartReference";
import { PartName } from "../values/parts/PartName";
import { Quantity } from "../values/parts/Quantity";
import { Price } from "../values/parts/Price";

export class Part {
  constructor(
    public readonly id: string,
    public readonly reference: PartReference,
    public readonly type: PartType,
    public readonly name: PartName,
    public readonly quantityInStock: Quantity,
    public readonly partThreshold: Quantity,
    public readonly unitPrice: Price,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  private static validateFields(
    reference: string,
    type: string,
    name: string,
    quantityInStock: number,
    partThreshold: number,
    unitPrice: number
  ): {
    reference: PartReference | Error;
    type: PartType | Error;
    name: PartName | Error;
    quantityInStock: Quantity | Error;
    partThreshold: Quantity | Error;
    unitPrice: Price | Error;
  } {
    return {
      reference: PartReference.from(reference),
      type: PartType.from(type),
      name: PartName.from(name),
      quantityInStock: Quantity.from(quantityInStock),
      partThreshold: Quantity.from(partThreshold),
      unitPrice: Price.from(unitPrice)
    };
  }

  static create(
    id: string,
    reference: string,
    type: string,
    name: string,
    quantityInStock: number,
    partThreshold: number,
    unitPrice: number,
    createdBy: string
  ): Part | Error {
    const { reference: validReference, type: validType, name: validName, quantityInStock: validQuantity, partThreshold: validThreshold, unitPrice: validPrice } =
      this.validateFields(reference, type, name, quantityInStock, partThreshold, unitPrice);

    if (validReference instanceof Error) return validReference;
    if (validType instanceof Error) return validType;
    if (validName instanceof Error) return validName;
    if (validQuantity instanceof Error) return validQuantity;
    if (validThreshold instanceof Error) return validThreshold;
    if (validPrice instanceof Error) return validPrice;

    return new Part(
      id,
      validReference,
      validType,
      validName,
      validQuantity,
      validThreshold,
      validPrice,
      createdBy,
      createdBy,
      new Date(),
      new Date()
    );
  }

  update(
    name?: string,
    quantityInStock?: number,
    partThreshold?: number,
    unitPrice?: number,
    updatedBy?: string
  ): Part | Error {
    const { name: validName, quantityInStock: validQuantity, partThreshold: validThreshold, unitPrice: validPrice } =
      Part.validateFields(
        this.reference.value, 
        this.type.value, 
        name ?? this.name.value,
        quantityInStock ?? this.quantityInStock.value,
        partThreshold ?? this.partThreshold.value,
        unitPrice ?? this.unitPrice.value
      );

    if (validName instanceof Error) return validName;
    if (validQuantity instanceof Error) return validQuantity;
    if (validThreshold instanceof Error) return validThreshold;
    if (validPrice instanceof Error) return validPrice;

    return new Part(
      this.id,
      this.reference,
      this.type,
      validName,
      validQuantity,
      validThreshold,
      validPrice,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
