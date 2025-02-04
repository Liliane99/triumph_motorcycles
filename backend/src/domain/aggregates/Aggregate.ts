export abstract class Aggregate<T> {
    protected events: T[] = [];
  
    getUncommittedEvents(): T[] {
      return this.events;
    }
  
    clearEvents(): void {
      this.events = [];
    }
}
  