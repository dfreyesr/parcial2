import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FotoDto {
  @IsNotEmpty()
  @IsNumber()
  readonly ISO: number;

  @IsNotEmpty()
  @IsNumber()
  readonly velObturacion: number;

  @IsNotEmpty()
  @IsNumber()
  readonly apertura: number;

  @IsNotEmpty()
  @IsString()
  readonly albumId: string;
}
