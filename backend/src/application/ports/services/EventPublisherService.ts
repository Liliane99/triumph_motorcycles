import { EventShape } from "../../../domain/events/EventShape";

export interface IEventPublisherService {
  publish(event: EventShape<any, any, any>, streamName: string): Promise<void>;
}
