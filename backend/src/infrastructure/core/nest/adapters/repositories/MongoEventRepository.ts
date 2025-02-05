import { Injectable } from "@nestjs/common";
import { MongoClient, Db, Collection } from "mongodb";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { EventShape } from "../../../../../domain/events/EventShape";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class MongoEventRepository implements IEventPublisherService {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<EventShape<string, number, object> & { streamName: string }>;
  private isConnected = false;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL;
    const mongoDbName = process.env.MONGO_INITDB_DATABASE;
    const mongoCollection = process.env.MONGO_EVENT_COLLECTION;

    if (!mongoUrl || !mongoDbName || !mongoCollection) {
      throw new Error("ERREUR : Les variables d'environnement MongoDB ne sont pas définies !");
    }

    this.client = new MongoClient(mongoUrl);
    this.db = this.client.db(mongoDbName);
    this.collection = this.db.collection<EventShape<string, number, object> & { streamName: string }>(mongoCollection);

    this.connect();
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      let attempts = 5;
      while (attempts > 0) {
        try {
          console.log(`Connexion à MongoDB... (${6 - attempts}/5)`);
          await this.client.connect();
          this.isConnected = true;
          console.log("Connexion réussie à MongoDB !");
          return;
        } catch (error) {
          console.error(`Échec de la connexion MongoDB : ${(error as Error).message}`);
          attempts--;
          await new Promise(res => setTimeout(res, 5000));
        }
      }
      throw new Error("Impossible de se connecter à MongoDB après plusieurs tentatives.");
    }
  }

  async publish<T extends string, V extends number, D extends object>(event: EventShape<T, V, D>, streamName: string): Promise<void> {
    await this.connect();

    try {
      await this.collection.insertOne({ ...event, streamName });
      console.log(`Événement publié dans ${streamName} : ${event.type}`);
    } catch (error) {
      console.error(`Échec de la publication de l'événement : ${(error as Error).message}`);
    }
  }
}
