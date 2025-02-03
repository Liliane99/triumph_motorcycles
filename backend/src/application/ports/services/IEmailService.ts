export interface IEmailService {
    sendLowStockAlert(
      recipientEmail: string,
      partName: string,
      quantityInStock: number
    ): Promise<void>;
  }
  