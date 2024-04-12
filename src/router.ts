import config from '@config'
import { Router } from 'express'
import * as fs from 'fs'
import * as path from 'path'

class router {
    public router
    private apisDirectory: string

    constructor() {
        this.router = Router()
        this.apisDirectory = path.join(__dirname, 'api')
    }

    /**
     * This will look up API definitions in the given `dir`
     * and will set up that API with the `router` so it is
     * exposed.
     */
    private setUpApisRecursively(dir: string) {
        const files = fs.readdirSync(dir)
        /**
         * During local development the `.ts` files are
         * being run through nodemon. On staging/production,
         * its the compiled `.js` files that are being run.
         */
        const fileExtension = config.IS_DEV ? '.ts' : '.js'
        files.forEach(file => {
            const filePath = path.join(dir, file)
            const stats = fs.statSync(filePath)
            if (stats.isDirectory()) {
                this.setUpApisRecursively(filePath)
            } else if (stats.isFile() && file.endsWith(fileExtension)) {
                const api = require(filePath)
                const routePath = filePath
                    /** Remove the base directory */
                    .replace(this.apisDirectory, '')
                    /** Remove the file extension */
                    .replace(fileExtension, '')
                    /** Replace backslashes with forward slashes */
                    .replace(/\\/g, '/')
                    /** `folder/index` => `/folder` path */
                    .replace(/index/g, '')
                const middlewares = api.middlewares || []
                if (api.get) {
                    this.router.get(
                        routePath,
                        ...middlewares,
                        ...(api.middlewaresGet || []),
                        api.get,
                    )
                }
                if (api.post) {
                    this.router.post(
                        routePath,
                        ...middlewares,
                        ...(api.middlewaresPost || []),
                        api.post,
                    )
                }
                if (api.put) {
                    this.router.put(
                        routePath,
                        ...middlewares,
                        ...(api.middlewaresPut || []),
                        api.put,
                    )
                }
                if (api.delete) {
                    this.router.delete(
                        routePath,
                        ...middlewares,
                        ...(api.middlewaresDelete || []),
                        api.delete,
                    )
                }
            }
        })
    }

    /**
     * The `/healthz` is required for K8s deployments.
     */
    private requiredAPIs() {
        this.router.get('/healthz', (req, res) => res.status(200).send('ok'))
    }

    public setUp() {
        this.setUpApisRecursively(this.apisDirectory)
        this.requiredAPIs()
    }
}
const r = new router()
export default r
