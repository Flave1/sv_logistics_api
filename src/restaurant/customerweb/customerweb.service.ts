import { Injectable, Req } from '@nestjs/common';
import { GatewayService } from 'src/gateway/gateway.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import * as qrcode from 'qrcode';
import * as streamToBuffer from 'stream-to-buffer';
import * as path from 'path';
import * as fs from 'fs';
import { getBaseUrl } from 'src/utils';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomerWebService {
  constructor(
    private prisma: PrismaService,
    private socket: GatewayService,
  ) {}
  async CreateQrCode(restaurantId: string, dto: CreateQrCodeDto, @Req() req: Request) {
    //Fetch restaurant details by restaurantId
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
      },
    });
    let menuPage, qrText, qrPath, savePath;

    if (dto.table.length == 0) {
      //Generate QRCode and save in a directory
      menuPage = `${getBaseUrl(req)}/all-menu?resId=${restaurantId}`;
      qrText = `${restaurant.name} - ${menuPage}`;

      const filename: string = uuidv4();
      qrPath = `src\\uploads\\qrcodes\\${restaurant.name.replace(' ', '_')}_${filename}.png`;
      savePath = path.join(process.cwd(), qrPath);

      const qrCodeBuffer = await this.generateQrCodeImage(qrText);
      this.saveQrCodeToFile(qrCodeBuffer, savePath);

      //Save QRCode details of the genrated QrCode in the RestaurantQrCode table
        await this.prisma.restaurantQrCode.create({
          data: {
            qrCode: qrPath,
            restaurantId: restaurantId,
            status: true,
            deleted: false
          },
        });
    } else {
      for (let i = 0; i < dto.table.length; i++) {
        //Generate QRCode and save in a directory
        menuPage = `${getBaseUrl(req)}/all-menu?resId=${restaurantId}&table=${dto.table[i]}`;
        qrText = `${restaurant.name} - ${menuPage}`;

        const filename: string = uuidv4();
        qrPath = `src\\uploads\\qrcodes\\${restaurant.name.replace(' ', '_')}_${filename}.png`;
        savePath = path.join(process.cwd(), qrPath);

        const qrCodeBuffer = await this.generateQrCodeImage(qrText);
        this.saveQrCodeToFile(qrCodeBuffer, savePath);

        //Save QRCode details of the genrated QrCode in the RestaurantQrCode table
        await this.prisma.restaurantQrCode.create({
            data: {
              qrCode: qrPath,
              restaurantId: restaurantId,
              table: dto.table[i],
              status: true,
              deleted: false
            },
          });
      }
    }
    return 'Successfully Generated';
  }
  private async generateQrCodeImage(text: string): Promise<Buffer> {
    return qrcode.toBuffer(text);
  }
  private saveQrCodeToFile(buffer: Buffer, filePath: string): void {
    fs.writeFileSync(filePath, buffer);
  }

  async getRestaurantQrCodes(restaurantId: string) {
    const restaurantQrCodes = await this.prisma.restaurantQrCode.findMany({
      where: {
        restaurantId: restaurantId,
        deleted: false,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    return restaurantQrCodes;
  }

  async getRestaurantQrCodeById(restaurantId: string, qrCodeId: string) {
    const restaurantQrCodes = await this.prisma.restaurantQrCode.findFirst({
      where: {
        id: qrCodeId,
        restaurantId: restaurantId,
        deleted: false,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    return restaurantQrCodes;
  }
}
