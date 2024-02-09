import * as fs from 'fs';
import { Request } from 'express';
import { OrderStatus } from 'src/restaurant/enums';
import { PaymentStatus } from './constants';
export const filterTolower = (text: string): string => text.toLowerCase().replace(/\s/g, '');

export const getRootDirectory = (): string => {
  const rootDirectory = process.cwd();
  return rootDirectory;
}

export const getBaseUrl = (request: Request) => {
  return `${request.protocol}://${request.get('host')}`;
}

export const fileExist = async (filePath: string = "nofile.png") => {
  try {
    await fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    await fs.accessSync(filePath, fs.constants.F_OK);
    console.log('deleted');

    await fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'Pending';
    case OrderStatus.CheckedOut:
      return 'Checked out';
    case OrderStatus.Cancelled:
      return 'Cancelled';
    case OrderStatus.Delivered:
      return 'Delivered';
    case OrderStatus.OrderAccepted:
      return 'Order Accepted';
    case OrderStatus.Packaged:
      return 'Packaged';
    case OrderStatus.Rejected:
      return 'Rejected';
    default:
      return 'Unknown Status';
  }
}

export function getStatusLabelForOrdersInKitchen(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.OrderAccepted:
      return 'PENDING';
    case OrderStatus.Packaged:
      return 'PREPARED';
    default:
      return 'Unknown Status';
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.unpaid:
      return 'UNPAID';
    case PaymentStatus.success:
      return 'PAID';
    case PaymentStatus.failed:
      return 'FAILED';
    case PaymentStatus.pending:
      return 'PENDING';
    default:
      return 'Unknown Status';
  }
}

export function getButtonColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'btn-outline-primary bgl-primary';
    case OrderStatus.CheckedOut:
      return 'btn-outline-info bgl-info';
    case OrderStatus.Cancelled:
      return 'btn-outline-danger bgl-danger';
    case OrderStatus.Delivered:
      return 'btn-outline-success bgl-success';
    case OrderStatus.OrderAccepted:
      return 'btn-outline-primary bgl-primary';
    case OrderStatus.Packaged:
      return 'btn-outline-light bgl-light';
    case OrderStatus.Rejected:
      return 'btn-outline-danger bgl-danger';
    default:
      return 'Unknown Status';
  }
}