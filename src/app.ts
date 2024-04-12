/** Required External Modules */
import express, { Request, Response } from 'express'
import router from './router'
import 'express-async-errors'
import docs from './middlewares/docs'
import cors from './middlewares/cors'
import bodyParsing from './middlewares/bodyParsing'
import helmet from './middlewares/helmet'
import config from './config'
import logger from './utils/logger'
import generateApiDocs from './docs'
import populateBodyWhenUsingQueryParams from './middlewares/populateBodyWhenUsingQueryParams'
import handleErrors from './middlewares/handleErrors'
import db from '@db/mysql/db'
import duration from '@middlewares/duration'
import humanizeDuration from '@utils/humanizeDuration'

class App {
    private port: string
    public app

    constructor() {
        this.port = config.PORT
        this.app = express()
    }

    /**
     * This must be done before
     */
    private initMiddlewares() {
        const middlewares = [
            ...cors,
            ...helmet,
            ...bodyParsing,
            ...docs,
            ...populateBodyWhenUsingQueryParams,
            ...duration,
        ]
        this.app.use(middlewares)
    }

    public async run() {
        router.setUp()
        generateApiDocs()
        this.initMiddlewares()
        this.app.use('/', router.router)
        /**
         * This must be done as THE LAST middleware. Otherwise
         * error handling will not work.
         */
        this.app.use(handleErrors)
        await db.connect()
        this.app.listen(this.port, () => {
            logger.info(`App running on port ${this.port}`)
        })
    }

    public runAutomatically() {
        if (!config.IS_TEST) this.run()
    }

    public ok(
        req: Request,
        res: Response,
        body: { [key: string]: any },
        status = 200,
    ) {
        const end = process.hrtime(req.body.__start)
        const responseTimeInNanoseconds = end[0] * 1e9 + end[1] // Convert to nanoseconds
        const responseTimeInMilliseconds = responseTimeInNanoseconds / 1e6
        const responseTimeInSeconds = responseTimeInNanoseconds / 1e9

        const duration = {
            milliseconds: parseFloat(responseTimeInMilliseconds.toFixed(1)),
            seconds: parseFloat(responseTimeInSeconds.toFixed(1)),
            human: humanizeDuration(responseTimeInMilliseconds),
        }
        res.status(status).json({ ...body, duration })
    }
}

const app = new App()
app.runAutomatically()

export default app
