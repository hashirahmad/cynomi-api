import path from 'path'
import { createDoc } from 'apidoc'
import logger from './utils/logger'
import router from './router'
import { Request, Response } from 'express'
import configuration from '@config'

export default function generateApiDocs() {
    const src = path.resolve(__dirname, 'api')
    const template = path.resolve(__dirname, '../apiDocsTemplate')
    const config = path.resolve(__dirname, '../apiDocsTemplate/config.js')
    const colorize = true
    const doc = createDoc({
        src,
        template,
        colorize,
        config,
        dest: path.resolve(__dirname, '../static', 'docs'),
        apiprivate: false,
    })
    const privateDocs = createDoc({
        src,
        dest: path.resolve(__dirname, '../static', 'private'),
        template,
        colorize,
        config,
        apiprivate: true,
    })

    if (typeof doc !== 'boolean') {
        logger.info('API docs generated')
    }
    if (typeof privateDocs !== 'boolean') {
        logger.info('API private docs generated')
    }
    router.router.get('/', (req: Request, res: Response) => {
        res.redirect(configuration.IS_DEV ? '/private' : '/docs')
    })
}
