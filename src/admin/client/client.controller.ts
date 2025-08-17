import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Status } from '@prisma/client';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilterClientDto } from './dto/filter-client.dto';

@ApiBearerAuth()
@Controller('admin/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('add')
  async addClient(@Body() createClientDto: CreateClientDto) {
    try {
      return await this.clientService.create(createClientDto);
    } catch (error) {
      return {
        message: 'Client creation failed',
        error: error,
      };
    }
  }

  @Get('list')
  async getClientList(
    @Query('page') page: number = 1,
    @Query() filters: FilterClientDto, // <- all DTO properties will appear
  ) {
    try {
       return this.clientService.findAll({ page: Number(page), filters });
    } catch (error) {
      return {
        message: 'Client list fetching failed',
        error: error,
      };
    }
   
  }

  @Get(':id')
  async searchClient(@Param('id') id: number) {
    try {
      return await this.clientService.findOne(id);
    } catch (error) {
      return {
        message: 'Client fetching failed',
        error: error,
      };
    }
  }

  @Patch('update/:id')
  async updateClient(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      return await this.clientService.update(id, updateClientDto);
    } catch (error) {
      return {
        message: 'Client update failed',
        error: error,
      };
    }
  }

  @Delete('delete/:id')
  async removeClient(@Param('id') id: number) {
    try {
      return await this.clientService.remove(id);
    } catch (error) {
      return {
        message: 'Client delete failed',
        error: error,
      };
    }
  }

  @Get('filter')
  async filterClients(@Query() filterDto: FilterClientDto) {
    try {
      return await this.clientService.filterClients(filterDto);
    } catch (error) {
      return {
        message: 'Client filtering failed',
        error: error.message || error,
      };
    }
  }
}
