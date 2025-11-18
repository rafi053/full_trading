import { NextFunction, Request, Response } from 'express';
import { ReqSchema, TypedRequest, SchemaOutput } from '../zod';

const wrapMiddleware = (func: (req: Request, res?: Response) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res);
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const wrapController = <T extends ReqSchema>(fn: (req: TypedRequest<T>, res: Response, next?: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req as unknown as TypedRequest<T>, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export const validateRequest = <T extends ReqSchema>(schema: T) => {
    return wrapMiddleware(async (req: Request) => {
        const parsed: SchemaOutput<T> = await schema.parseAsync({
            body: (req.body ?? {}) as Record<string, unknown>,
            query: (req.query ?? {}) as Record<string, unknown>,
            params: (req.params ?? {}) as Record<string, unknown>,
        });

        const r = req as unknown as TypedRequest<T>;
        r.body = parsed.body as typeof r.body;
        r.params = parsed.params as typeof r.params;

        try {
            r.query = parsed.query as typeof r.query;
        } catch {
            Object.defineProperty(r, 'query', {
                get: () => parsed.query,
                enumerable: true,
                configurable: true,
            });
        }
    });
};
