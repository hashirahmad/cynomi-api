import { NextFunction, Request, Response } from 'express'

/**
 * This is not really a real problem rather an issue to circumvent
 * around `apidocjs` problem. By default `@apiBody` should be used
 * so that it sends it as JSON body yet this makes it nightmare problem
 * to stringify the JSON in the text field. So this middleware simply
 * populates `req.body` with `req.query` when `req.body` is empty.
 */
export default [
    (req: Request, res: Response, next: NextFunction) => {
        const { body, query } = req
        /**
         * Lets make sure we only do this when `body` is empty
         */
        if (!Object.keys(body).length) {
            req.body = query
        }
        next()
    },
]
