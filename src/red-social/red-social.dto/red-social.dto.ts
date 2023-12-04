import { IsNotEmpty, IsString } from 'class-validator';

export class RedSocialDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly slogan: string;
}
