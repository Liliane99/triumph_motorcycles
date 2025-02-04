export class RentalReference {
    private reference: string;
  
    constructor(reference?: string) {
      
      if (reference) {
        this.validate(reference);
        this.reference = reference;
      } else {
        
        this.reference = this.generateReference();
      }
    }
  
    private validate(reference: string): void {
      
      const referenceRegex = /^LOC\d{3}$/;
      if (!referenceRegex.test(reference)) {
        throw new Error("The reference must start with 'LOC' followed by 3 digits.");
      }
    }
  
    private generateReference(): string {
      
      const randomNumber = Math.floor(Math.random() * 900) + 100; 
      return `LOC${randomNumber}`;
    }
  
    getReference(): string {
      return this.reference;
    }
  
    
    updateReference(newReference: string) {
      this.validate(newReference);
      this.reference = newReference;
    }
  }
  