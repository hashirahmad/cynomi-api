import db from '@db/mysql/db'
import bodyValidation from '@middlewares/bodyValidation'
import { ApiError } from '@utils/apiError'
import moment from 'moment'
import history from './history'

type args = {
    gender: string
    name: string
    duration: number
    day: string
}

const dateFormat = 'YYYY-MM-DD'
const validationRules = [
    bodyValidation.isEnum('gender', 'Male', ['Male', 'Female']),
    bodyValidation.isAlphanumericIncSpaces('name', 8, 100, ''),
    bodyValidation.isFloat('duration', 7, 1, 24),
    bodyValidation.isAlphanumericIncCommonChars(
        'day',
        10,
        10,
        moment().format(dateFormat),
    ),
]

/**
 * It will make sure that inputs are validated and early exit
 * when not valid.
 */
async function validateInputs(args: args) {
    await bodyValidation.validateInLogic(args, validationRules)
    const isDayFormatted = moment(args.day, dateFormat).isValid()
    if (!isDayFormatted) {
        throw new ApiError({
            description: `${args.day} as day must be formatted as ${dateFormat}`,
            errorCode: 'BAD_INPUTS',
        })
    }
    const isFullName = args.name.includes(' ')
    if (!isFullName) {
        throw new ApiError({
            description: `${args.name} does not appear to be your full name`,
            errorCode: 'BAD_INPUTS',
        })
    }
}

/**
 * Creates a sleep log entry into the database.
 */
async function create(args: args) {
    await validateInputs(args)
    const already = await history.getIndividualEntry(args)
    const params = {
        name: args.name,
        gender: args.gender,
        duration: args.duration,
        dayDate: args.day,
    }

    if (already.length === 1) {
        await db.updateById(
            'SleepLog',
            {
                id: already[0].id,
                ...params,
            },
            true,
        )
        return { ...params, id: already[0].id }
    }

    const result = await db.insert('SleepLog', params, true)
    return { ...params, id: result.insertId }
}

export default { create, validationRules, dateFormat }
