import { httpCode, ApiError } from '@/utils/apiError'
import logger from '@/utils/logger'
import app from '@app'
import config from '@config'
import { Request, Response } from 'express'
import * as validator from 'express-validator'

class ErrorHandling {
    private isTrustedError(err: Error): boolean {
        if (err instanceof ApiError) {
            return err.isOperational
        }

        return false
    }

    /**
     * To prevent invalid JSON `body`|`query`|`params` where basically the request cannot
     * be parsed as `JSON` at the middleware.
     */
    private isInvalidJsonRequest(err: Error) {
        if (
            err instanceof SyntaxError &&
            err.message.includes('Unexpected token')
        ) {
            return true
        }
        return false
    }

    /**
     * This is where we handle those errors such as `ApiError` and we
     * directly sent the contents back to the client.
     */
    private handleTrustedError(
        error: ApiError,
        request: Request,
        response: Response,
    ): void {
        app.ok(
            request,
            response,
            {
                message: error.message,
                errorCode: error.errorCode,
                isOperational: error.isOperational,
                details: error.details,
                user_message: error.message,
                error_code: error.errorCode,
            },
            error.httpCode,
        )
    }

    /**
     * Inform the client the `body`|`query`|`params` being passed to the request
     * is invalid.
     */
    private handleInvalidPayloadError(
        error: Error,
        request: Request,
        response: Response,
    ) {
        const message =
            'The query or params or body passed to the request must be a valid JSON'
        const errorCode = 'INVALID_JSON_REQUEST'
        app.ok(
            request,
            response,
            {
                message,
                errorCode,
                isOperational: true,
                details: {
                    ...error,
                    expose: undefined,
                    stack: undefined,
                    parsedBody: { ...request.body, __start: undefined },
                    parsedParams: { ...request.params, __start: undefined },
                    parsedQuery: { ...request.query, __start: undefined },
                },
                user_message: message,
                error_code: errorCode,
            },
            httpCode.BAD_REQUEST,
        )
    }

    /**
     * This is where we handle those unexpected errors like `Error`. It could be
     * anything we are not deliberately throwing ourselves.
     */
    private handleCriticalError(
        err: Error | ApiError,
        request: Request,
        response?: Response,
    ): void {
        if (response) {
            const message = 'Uh-oh! We just encountered a hiccup . . .'
            const errorCode = 'INTERNAL_SYSTEM_ERROR'
            app.ok(
                request,
                response,
                {
                    message,
                    errorCode,
                    user_message: message,
                    error_code: errorCode,
                },
                httpCode.INTERNAL_SERVER_ERROR,
            )
        } else {
            console.error('Application encountered a critical error. Exiting')
            process.exit(1)
        }
    }

    /**
     * This will take care of bad API `body`|`query`|`param` when it does not meet
     * the minimum requirement for the particular API.
     */
    public handleBadRequestIfNeeded(req: Request) {
        const result = validator.validationResult(req)
        if (!result.isEmpty()) {
            const uniqueErrors = Array.from(
                new Set(result.array().map(item => item.msg)),
            )
            const description = uniqueErrors.join(' and ')
            throw new ApiError({
                description,
                details: uniqueErrors,
            })
        }
    }

    /** Handle the actual error and deals with it appropriately */
    public handle(err: Error | ApiError, req: Request, res: Response): void {
        if (this.isTrustedError(err) && res) {
            if (config.LOG_ALL_API_ERRORS) {
                logger.info(`ApiError •`, err)
            }
            this.handleTrustedError(err as ApiError, req, res)
        } else if (this.isInvalidJsonRequest(err)) {
            this.handleInvalidPayloadError(err, req, res)
        } else {
            logger.err(err.message, err)
            this.handleCriticalError(err, req, res)
        }
    }
}

export default new ErrorHandling()
