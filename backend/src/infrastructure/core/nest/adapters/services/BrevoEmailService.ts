import { Injectable } from "@nestjs/common";
import axios from "axios";
import { IEmailService } from "../../../../../application/ports/services/IEmailService";


@Injectable()
export class BrevoEmailService implements IEmailService {
  private readonly apiUrl = "https://api.brevo.com/v3/smtp/email";
  private readonly apiKey = process.env.BREVO_API_KEY!;
  private readonly templateId = Number(process.env.BREVO_TEMPLATE_ID!);
  private readonly maintenanceTemplateId = Number(process.env.BREVO_TEMPLATE_ID_MAINTENANCE!);

  async sendLowStockAlert(recipientEmail: string, partName: string, quantityInStock: number): Promise<void> {
    const payload = {
      to: [{ email: recipientEmail }],
      templateId: this.templateId,
      params: {
        part_name: partName,
        quantity_in_stock: quantityInStock,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "api-key": this.apiKey,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, { headers });
      console.log("Email envoyé avec succès :", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Erreur lors de l'envoi de l'email :", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue lors de l'envoi de l'email");
      }
    }
  }

  async sendMaintenanceAlert(
    motorcycleId: string,
    currentKm: number,
    maintenanceInterval: number,
    recipientEmail: string
  ): Promise<void> {
    const payload = {
      to: [{ email: recipientEmail }],
      templateId: this.maintenanceTemplateId, 
      params: {
        motorcycle_id: motorcycleId, 
        current_km: currentKm, 
        maintenance_interval: maintenanceInterval, 
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "api-key": this.apiKey,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, { headers });
      console.log("Email d'alerte de maintenance envoyé avec succès :", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Erreur lors de l'envoi de l'email d'alerte de maintenance :", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue lors de l'envoi de l'email d'alerte de maintenance");
      }
    }
  }

}
