import { ApiError } from '@utils/apiError'
import * as validator from 'express-validator'
import moment from 'moment'
import { Request } from 'express'

/**
 * The parameter must be of an alphanumeric format with possible
 * exception specified when needed or left alone. It will also make
 * sure that this is all within specified range
 */
function isAlphanumeric(
    fieldName: string,
    min: number,
    max: number,
    defaultValue = '',
    regex: RegExp | string,
    allowedChars = '',
) {
    return validator
        .check(fieldName, `${fieldName} is required`)
        .default(defaultValue)
        .notEmpty()
        .isLength({ min, max })
        .withMessage(`${fieldName} must be within ${min} and ${max} chars long`)
        .matches(regex)
        .withMessage(
            `${fieldName} must be in alphanumeric format with few aloud characters: ${allowedChars}`,
        )
        .escape()
}

/** A parameter with alphanumeric yet with spaces allowed */
function isAlphanumericIncSpaces(
    fieldName: string,
    min: number,
    max: number,
    defaultValue: string,
) {
    return isAlphanumeric(
        fieldName,
        min,
        max,
        defaultValue,
        /^[\w ]*$/g,
        ' (space)',
    )
}

/** A parameter with alphanumeric yet with . allowed */
function isAlphanumericIncDots(
    fieldName: string,
    min: number,
    max: number,
    defaultValue: string,
) {
    return isAlphanumeric(fieldName, min, max, defaultValue, /^[\w.]*$/g, '.')
}

/** A parameter with alphanumeric without any spaces allowed */
function isAlphanumericNoSpaces(
    fieldName: string,
    min: number,
    max: number,
    defaultValue: string,
) {
    return isAlphanumeric(fieldName, min, max, defaultValue, /^[\w]*$/g)
}

/**
 * A parameter with alphanumeric yet with few common
 * characters allowed like `(space),?~$£€:`
 */
function isAlphanumericIncCommonChars(
    fieldName: string,
    min: number,
    max: number,
    defaultValue: string,
) {
    return isAlphanumeric(
        fieldName,
        min,
        max,
        defaultValue,
        /^[\w ,?~$£€:*#_/.-]*$/g,
        ' (space),?~$£€:*#_/.-',
    )
}

/**
 * Makes sure that parameter is within provided set of values
 */
function isEnum(fieldName: string, defaultValue: string, values: string[]) {
    return validator
        .check(fieldName)
        .default(defaultValue)
        .isIn(values)
        .withMessage(`${fieldName} must one of: ${values.join(', ')}`)
        .escape()
}

/**
 * Param to be an float.
 */
function isFloat(
    fieldName: string,
    defaultValue: number,
    min: number,
    max: number,
) {
    return validator
        .check(fieldName)
        .default(defaultValue)
        .custom(value => {
            value = Number(value)
            if (value < min) {
                throw new ApiError({
                    description: `${fieldName} (${value}) must be at least ${min}`,
                })
            }
            if (value > max) {
                throw new ApiError({
                    description: `${fieldName} (${value}) must be no more than ${max}`,
                })
            }
            /** It just needs to return truthy value */
            return true
        })
}

async function validateInLogic(
    data: { [key: string]: any },
    validationRules: validator.ValidationChain[],
) {
    const req = { body: data } as Request
    for (const rule of validationRules) {
        await rule(req, {}, () => {
            /** Matters not */
        })
    }

    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
        const uniqueErrors = Array.from(
            new Set(errors.array().map(item => item.msg)),
        )
        const description = uniqueErrors.join(' and ')
        throw new ApiError({
            description,
            details: errors,
        })
    }
}

export default {
    isAlphanumericIncCommonChars,
    isAlphanumericIncSpaces,
    isAlphanumericNoSpaces,
    isAlphanumericIncDots,
    isEnum,
    isFloat,
    validateInLogic,
}
