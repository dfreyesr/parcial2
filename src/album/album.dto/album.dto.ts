import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  readonly titulo: string;

  @IsNotEmpty()
  @IsDateString()
  readonly fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  readonly fechaFin: string;
}
