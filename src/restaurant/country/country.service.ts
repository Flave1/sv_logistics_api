import { Injectable, NotFoundException } from "@nestjs/common";
import { GatewayService } from "src/gateway/gateway.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { Status, StatusMessage } from "../enums";
import { DeleteDto } from "src/dto/delete.dto";
import { APIResponse } from "src/dto/api-response";
import { CountryManagementEvents } from "src/gateway/dto";
import { UpdateCountryDto } from "./dto/update-country.dto";

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService, private socket: GatewayService) { }

  async CreateCountry(dto: CreateCountryDto) {
    const country = await this.prisma.country.create({
      data: {
        countryName: dto.countryName,
        countryCode: dto.countryCode,
        currencyName: dto.currencyName,
        currencyCode: dto.currencyCode,
        deleted: false,
        status: dto.status
      },
    });
    this.socket.emitToClient(CountryManagementEvents.get_countries_event)
    return country;
  }

  async getCountries() {
    const countries = (await this.prisma.country.findMany({
      where: {
        deleted: false
      },
      orderBy: [
        {
          createdAt: 'desc',
        }
      ]
    }));
    return countries;
  }

  async getCountryById(countyId: string) {
    try {
      const country = await this.prisma.country.findFirst({
        where: {
          id: parseInt(countyId),
          deleted: false
        }
      });
      if (!country) {
        throw new NotFoundException(StatusMessage.NoRecord);
      }
      return country;
    } catch (error) {
      throw error
    }
  }


  async UpdateCountryById(dto: UpdateCountryDto) {
    const country =
        await this.prisma.country.findUnique({
            where: {
                id: dto.id,
                deleted: false
            },
        });

    if (!country)
        throw new NotFoundException('Item not found');

    this.socket.emitToClient(CountryManagementEvents.get_countries_event)
    return this.prisma.country.update({
        where: {
            id: dto.id,
        },
        data: {
            countryName: dto.countryName,
            countryCode: dto.countryCode,
            currencyName: dto.currencyName,
            currencyCode: dto.currencyCode,
            status: dto.status
        },
    });
}

async deleteCountryById(dto: DeleteDto) {
    try {
      const country = await this.prisma.country.updateMany({
        where: {
          id: {
            in: dto.id.map(id => parseInt(id)),
          }
        },
        data: {
          deleted: true
        },
      });
      this.socket.emitToClient(CountryManagementEvents.get_countries_event)
      return new APIResponse(Status.Success, StatusMessage.Deleted, null);
    } catch (error) {
      throw error;
    }
  }
}