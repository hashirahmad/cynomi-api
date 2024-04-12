import { ResultSetHeader } from 'mysql2'

export interface SleepLog {
    id: number
    name: string
    gender: string
    duration: number
    dayDate: string
}

type SleepLogTableRow = SleepLog & ResultSetHeader
export type SleepLogInsert = Omit<SleepLog, 'id'>
export type SleepLogTable = SleepLogTableRow[]

export type SleepLogEntriesPerPerson = ResultSetHeader &
    Pick<SleepLog, 'gender' | 'name'>[] &
    {
        entries: number
    }[]
