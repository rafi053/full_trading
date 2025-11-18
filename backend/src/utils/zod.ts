import { Request } from 'express';
import { z, ZodObject, ZodRawShape } from 'zod';

export const zodMongoObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid ObjectId',
});

export type ReqSchema = ZodObject<{
    body: ZodObject<ZodRawShape>;
    query: ZodObject<ZodRawShape>;
    params: ZodObject<ZodRawShape>;
}>;

export type SchemaOutput<T extends ReqSchema> = z.infer<T>;

type AsObj<T> = T extends object ? T : Record<string, never>;

export type TypedRequest<T extends ReqSchema> = Request<
    AsObj<SchemaOutput<T>['params']>,
    unknown,
    AsObj<SchemaOutput<T>['body']>,
    AsObj<SchemaOutput<T>['query']>
>;
