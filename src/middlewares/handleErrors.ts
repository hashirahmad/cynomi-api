import { ApiError } from '@/utils/apiError'
import errHandling from '@/utils/errorHandling'
import { NextFunction, Request, Response } from 'express'

export default [
    (
        err: Error | ApiError,
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        errHandling.handle(err, req, res)
    },
]
