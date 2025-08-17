import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './client.repository';
import { FilterClientDto } from './dto/filter-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly ClientRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto) {
    const ClientInfo = await this.ClientRepository.addClient(createClientDto);

    if (!ClientInfo) throw new ConflictException('Something went wrong');

    return {
      Message: 'Client created successfully',
      data: ClientInfo,
    };
  }

  async findAll({
    page = 1,
    filters = {},
  }: {
    page?: number;
    filters?: FilterClientDto;
  }) {
    const CLIENT_PAGE_LIMIT = Number(process.env.PAGE_LIMIT) || 10;

    const clientList = await this.ClientRepository.findAllClient(
      page,
      CLIENT_PAGE_LIMIT,
      filters,
    );

    // Customize the data returned
    const data = clientList.data.map((client) => ({
      id: client.id,
      hospitalName: client.hospitalName,
      alias: client.alias,
      contactNumber: client.contactNumber,
      address: client.address,
      city: client.city,
      state: client.state,
      country: client.country,
      landmark: client.landmark,
    }));

    return {
      message: 'Client list fetched successfully',
      data,
      currentPage: clientList.currentPage,
      totalPages: clientList.totalPages,
      limit: clientList.limit,
      totalRecords: clientList.totalRecords,
    };
  }

  async findOne(id: number) {
    const Client = await this.ClientRepository.findClientById(id);
    if (!Client) throw new NotFoundException('Client not found');

    return { Message: 'Client fetched successfully', data: Client };
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const existing = await this.ClientRepository.findClientById(id);
    if (!existing) throw new NotFoundException('Client not found');

    const updateClient = await this.ClientRepository.updateClient(
      id,
      updateClientDto,
    );
    return {
      Message: 'Client updated successfully',
      data: updateClient,
    };
  }

  async remove(id: number) {
    const isDeleted = await this.ClientRepository.softDeleteClient(id);
    if (!isDeleted) throw new NotFoundException('Client not found');

    return { Message: 'Staff deleted successfully' };
  }

  async filterClients(filterDto: FilterClientDto) {
    return this.ClientRepository.filterClients(filterDto);
  }

  // async getClientJobs(id: number) {
  //   return await this.ClientRepository.getClientJobs(id);
  // }
}
