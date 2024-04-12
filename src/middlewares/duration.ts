import { NextFunction, Request, Response } from 'express'

export default [
    (req: Request, res: Response, next: NextFunction) => {
        const start = process.hrtime()
        req.body.__start = start
        next()
    },
]
