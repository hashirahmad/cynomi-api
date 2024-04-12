import db from '@db/mysql/db'
import bodyValidation from '@middlewares/bodyValidation'
import moment from 'moment'
import { SleepLogEntriesPerPerson, SleepLogTable } from '../../db/mysql/types'
import entry from './entry'

type args = {
    gender: string
    name: string
}

const validationRules = [
    bodyValidation.isEnum('gender', 'Male', ['Male', 'Female']),
    bodyValidation.isAlphanumericIncSpaces('name', 8, 100, ''),
]

/**
 * It will make sure that inputs are validated and early exit
 * when not valid.
 */
async function validateInputs(args: args) {
    await bodyValidation.validateInLogic(args, validationRules)
}

/**
 * Gets the entries per person of sleep log.
 */
async function entriesPerPerson() {
    const sql = `
        select
            count(SleepLog.id) as entries, 
            SleepLog.name,
            SleepLog.gender
        from SleepLog
        group by SleepLog.name, SleepLog.gender
    `
    const [rows] = await db.pool.query<SleepLogEntriesPerPerson>(sql, [])
    return rows
}

/**
 * Gets sleep logs of the past 7 days for a given person
 * by `name` and `gender`.
 */
async function moreDetailOfPerson(args: args) {
    await validateInputs(args)
    const lastSevenDays = moment().subtract(7, 'days').format(entry.dateFormat)
    const sql = `
        select *
        from SleepLog
        where
            SleepLog.name = ?
            and SleepLog.gender = ?
            and SleepLog.dayDate >= ?
        order by SleepLog.dayDate asc
    `
    const params = [args.name, args.gender, lastSevenDays]
    const [rows] = await db.pool.query<SleepLogTable>(sql, params)
    return rows.map(o => ({
        ...o,
        dayDate: moment(o.dayDate).format(entry.dateFormat),
    }))
}

/**
 * Get an individual entry for a given `day`
 * by same `name` and `gender`.
 */
async function getIndividualEntry(args: args & { day: string }) {
    await validateInputs(args)
    const sql = `
        select *
        from SleepLog
        where
            SleepLog.name = ?
            and SleepLog.gender = ?
            and SleepLog.dayDate = ?
    `
    const params = [args.name, args.gender, args.day]
    const [rows] = await db.pool.query<SleepLogTable>(sql, params)
    return rows.map(o => ({
        ...o,
        dayDate: moment(o.dayDate).format(entry.dateFormat),
    }))
}

export default {
    entriesPerPerson,
    moreDetailOfPerson,
    validationRules,
    getIndividualEntry,
}
