import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto/usuario.dto';

@Controller('usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() usuarioDto: UsuarioDto) {
    return await this.usuarioService.createUsuario(usuarioDto);
  }

  @Get(':usuarioId')
  async findOne(@Param('usuarioId') usuarioId: number) {
    return await this.usuarioService.findUsuarioById(usuarioId);
  }

  @Get()
  async findAll() {
    return await this.usuarioService.findAllUsuarios();
  }
}
