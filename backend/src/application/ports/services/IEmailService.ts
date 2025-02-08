export interface IEmailService {
    sendLowStockAlert(
      recipientEmail: string,
      partName: string,
      quantityInStock: number
    ): Promise<void>;

    sendMaintenanceAlert(
      motorcycleId: string,
      currentKm: number,
      maintenanceInterval: number,
      recipientEmail: string
    ): Promise<void>;

  }

  