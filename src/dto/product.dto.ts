import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class ProductDto {
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @MinLength(5)
    @MaxLength(400)
    @IsNotEmpty()
    description: string;

    productId?: string;
}