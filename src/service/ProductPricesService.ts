import {ResponseData} from "../controller/ResponseData";
import {StatusCodes} from "http-status-codes";
import {getRepository} from "typeorm";
import {ProductPrices} from "../entity/ProductPrices";
import {Products} from "../entity/Products";

export type ProductPriceRequest = {
    product_id: number;
    price: number;
    validFrom: Date;
    validTo: Date;
}

export class ProductPricesService {

    async list(pageNumber: number, pageSize: number): Promise<ResponseData> {
        const list = await  getRepository(ProductPrices).find({
            relations:["product"],
            skip: pageNumber * pageSize,
            take: pageSize,
            order: {
                product_id: "ASC",
                id: "ASC",
                validFrom: "ASC"
            }
        });
        return new ResponseData(StatusCodes.OK, "", list);
    }

    async listByProduct(product_id: number): Promise<ResponseData> {
        const list = await getRepository(ProductPrices).find({
            relations:["product"],
            where: {
                product_id: product_id
            },
            order: {
                id: "ASC",
                validFrom: "ASC"
            }
        })
        return new ResponseData(StatusCodes.OK, "", list);
    }

    async delete(id: number): Promise<ResponseData> {
        const productPrice = await getRepository(ProductPrices).findOne(id);
        if (!productPrice) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Preço de Produto com Id informado não existe!");
        }
        await getRepository(ProductPrices).delete({id});
        return new ResponseData(StatusCodes.OK, "Preço de Produto removido com Sucesso!", productPrice);
    }

    async deleteByProduct(productId: number): Promise<ResponseData> {
        const prices = await getRepository(ProductPrices).find({ product_id: productId});
        if (!prices) {
            return new ResponseData(StatusCodes.NOT_FOUND, "Não existem preços cadastrados para o Produto informado!");
        }
        await getRepository(ProductPrices).delete({
            product_id: productId
        });
        return new ResponseData(StatusCodes.OK, "Os Preços do Produto informado foram removido com Sucesso!", prices);
    }

    // TODO: include additional validation (check if valid price for product already exists)
    async create({product_id, price, validFrom, validTo}: ProductPriceRequest): Promise<ResponseData> {
        const repository = getRepository(ProductPrices);
        const ppr = {
            product_id: Number(product_id),
            price: Number(price),
            validFrom: new Date(validFrom),
            validTo: new Date(validTo)
        }
        const productPrice = await repository.create(ppr);
        await getRepository(ProductPrices).save(productPrice);
        return new ResponseData(StatusCodes.OK, "Prices added", productPrice);
    }

    // TODO: include additional validation (check if valid price for product already exists)
    async createAll(data: ProductPriceRequest[]): Promise<ResponseData> {
        const repository = getRepository(ProductPrices);
        let prices: ProductPrices[] = [];

        for (let i = 0; i < data.length; i++) {
            const ppr = {
                product_id: Number(data[i].product_id),
                price: Number(data[i].price),
                validFrom: new Date(data[i].validFrom),
                validTo: new Date(data[i].validTo)
            }
            const productPrice = await repository.create(ppr);
            if (productPrice) {
                await getRepository(ProductPrices).save(productPrice);
                prices.push(productPrice);
            }
        }
        return new ResponseData(StatusCodes.OK, "Prices added", prices);
    }
}