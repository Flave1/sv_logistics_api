import { BadRequestException, Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressDto, CreateAddressDto, EditAddressDto } from '../dto/address.dto';

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateAddressDto): Promise<CreateAddressDto> {
        const existingAddress = await this.prisma.address.findFirst({ where: { label: data.label, customerId: data.customerId } });

        if (existingAddress) {
            throw new BadRequestException(`Address with label '${data.label}' already exists.`);
        }
        return this.prisma.address.create({ data });
    }

    async findAll(customerId: number): Promise<AddressDto[]> {
        return this.prisma.address.findMany({ where: { customerId: customerId } });
    }

    async findOne(id: number): Promise<AddressDto | null> {
        return this.prisma.address.findUnique({ where: { id } });
    }

    async update(id: number, dto: EditAddressDto): Promise<AddressDto | null> {


        const existingAddress = await this.prisma.address.findFirst({
            where: {
                label: dto.label,
                customerId: dto.customerId,
                NOT: {
                    id
                }
            }
        });

        if (existingAddress) {
            throw new BadRequestException(`Address with label '${dto.label}' already exists.`);
        }

        const address = await this.prisma.address.update({
            where: {
                id: id,
            },
            data: {
                ...dto,
            },
        });
        return address;
    }

    async remove(id: number): Promise<void> {
        await this.prisma.address.delete({ where: { id } });
    }

    async setDefaultAddress(id: number, custommerId: number): Promise<Address | null> {
        const currentDefaultAddress = await this.prisma.address.findFirst({
            where: { customerId: custommerId, isDefault: true },
        });

        if (currentDefaultAddress) {
            await this.prisma.address.update({
                where: { id: currentDefaultAddress.id },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });
    }
}
