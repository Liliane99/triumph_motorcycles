export class EventStore {
    private events: any[] = [];
  
    save(event: any): void {
      this.events.push(event);
    }
  
    getAll(): any[] {
      return this.events;
    }
  }
  