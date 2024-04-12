import * as dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'

/**
 * We will configure all environment variables.
 * `envalid` will throw an error, if we forget
 * to provide any of the defined variables or
 * if they’re of the wrong types.
 */
function configure() {
    dotenv.config()
    const config = cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: str(),
        DB_HOST: str(),
        DB_NAME: str(),
        DB_USER: str(),
        DB_PASSWORD: str(),
    })
    const isDev = config.NODE_ENV === 'local'
    const isProd = config.NODE_ENV === 'production'
    const isStg = config.NODE_ENV === 'staging'
    const isTest = config.NODE_ENV.startsWith('test:')
    return {
        ...config,
        IS_DEV: isDev,
        IS_STG: isStg,
        IS_PROD: isProd,
        IS_TEST: isTest,
        LOG_ALL_API_ERRORS: false,
    }
}

export default configure()
