export enum httpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface ApiErrorArgs {
    errorCode?: string
    httpCode?: httpCode
    description: string
    details?: object
    isOperational?: boolean
}

export class ApiError extends Error {
    /**
     * An error code that should be sent back to the clint. This
     * should be consistently same for the same type of errors. For
     * example all input error can have `INVALID_PARAM` as error code.
     */
    public readonly errorCode: string
    /** The HTTP status code for the response */
    public readonly httpCode: httpCode
    /**
     * The idea is that if an error is considered `isOperational` then
     * we can continue doing business as usual. If however it is not then
     * we need to take serious measures such as notify the admins to take
     * appropriate action.
     */
    public readonly isOperational: boolean = true
    /**
     * Optional details that may be sent to the client as part of
     * the error response.
     */
    public readonly details: object = {}

    constructor(args: ApiErrorArgs) {
        super(args.description)

        Object.setPrototypeOf(this, new.target.prototype)

        this.errorCode = args.errorCode || 'INVALID_PARAM'
        this.details = args.details || this.details
        this.isOperational = args.isOperational || this.isOperational
        this.httpCode = args.httpCode || httpCode.BAD_REQUEST

        Error.captureStackTrace(this)
    }
}
