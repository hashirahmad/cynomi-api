import { ApiError } from '@/utils/apiError'
import config from '@/config'
import logger from '@/utils/logger'
import * as mysql from 'mysql2/promise'

class Db {
    public readonly pool: mysql.Pool
    private readonly primaryKeys
    public connected: boolean

    constructor() {
        this.connected = false
        this.pool = mysql.createPool({
            connectionLimit: 25,
            queueLimit: 0,
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
            charset: 'utf8mb4',
            port: 3307,
        })
        this.primaryKeys = {
            SleepLog: 'id',
        }
    }

    private handleEarlyExit(earlyExit: boolean) {
        if (earlyExit) {
            throw new ApiError({
                isOperational: false,
                description:
                    'System encountered database anomaly. Try again in few hours',
                errorCode: 'TRY_LATER',
            })
        }
    }

    private assertDbConnected() {
        if (!this.connected) {
            throw new ApiError({
                description:
                    'The database is not connected . . ., the system is under maintenance',
                isOperational: false,
            })
        }
    }

    /**
     * Must be called at `app.ts` to ensure database is connected.
     */
    async connect() {
        try {
            await this.pool.query('select * from SleepLog limit 1')
            this.connected = true
            logger.info('Database successfully connected')
        } catch (err) {
            logger.err(
                `Database not connected ${config.DB_HOST}@${config.DB_USER}`,
                { err },
            )
        }
    }

    /**
     * It will insert specified `row` object into the
     * specified `table`.
     */
    async insert(
        table: string,
        row: object,
        earlyExit: boolean,
        connection = this.pool,
    ) {
        const columns = Object.keys(row)
            .map(k => `\`${k}\``)
            .join(', ')
        const values = Object.keys(row)
            .map(() => `?`)
            .join(', ')
        const sql = `
            insert into ${table} (${columns})
            values (${values})
        `
        const params = Object.values(row)
        const [rows] = await connection.query<mysql.ResultSetHeader>(
            sql,
            params,
        )
        const { affectedRows, insertId } = rows
        if (affectedRows !== 1) {
            logger.err(`insert for '${table}' failed`, { rows, row })
            this.handleEarlyExit(earlyExit)
        }
        return { ...rows, insertId }
    }

    /**
     * It will delete specified `row` object from the
     * specified `table`.
     */
    async deleteById(
        table: string,
        id: string,
        earlyExit: boolean,
        connection = this.pool,
    ) {
        const pk = this.primaryKeys[table as keyof typeof this.primaryKeys]
        const sql = `
            delete from ${table}
            where ${pk} = ?
        `

        const params = [id]
        const [rows] = await connection.query<mysql.ResultSetHeader>(
            sql,
            params,
        )
        const { affectedRows } = rows
        if (affectedRows !== 1) {
            logger.err(`delete for '${table}' failed`, { table, id })
            this.handleEarlyExit(earlyExit)
        }
        return rows
    }

    /**
     * It will take in `row` object alongside the
     * corresponding `table` and generate the SQL needed
     * to update all the fields present in the `row` object.
     */
    transformRowToColumns(table: string, row: object) {
        const fields = Object.keys(row)
        const pk = this.primaryKeys[table as keyof typeof this.primaryKeys]
        const sqlArray = fields.map((field, i) => {
            if (field === pk) return ''
            const last = i === fields.length - 1
            const comma = last ? '' : ','
            return `${field} = ?${comma}`
        })
        const sql = sqlArray.join(' ')
        return sql
    }

    /**
     * It will update specified `table` according
     * to the specified `row` object.
     */
    async updateById(
        table: string,
        row: object,
        earlyExit: boolean,
        connection = this.pool,
    ) {
        const columns = this.transformRowToColumns(table, row)
        const pk = this.primaryKeys[table as keyof typeof this.primaryKeys]
        const sql = `
            update ${table}
            set ${columns}
            where ${pk} = ?
        `
        /**
         * We are cloning so that we can remove
         * the primary key field so that values
         * array is all in the right order.
         */
        const clonedRow = { ...row }
        delete clonedRow[pk as keyof typeof clonedRow]
        const params = Object.values(clonedRow)
        /**
         * Adding the primary key value at last for
         * the where clause
         */
        params.push(row[pk as keyof typeof row])

        const [rows] = await connection.query<mysql.ResultSetHeader>(
            sql,
            params,
        )
        const updated = rows.affectedRows === 1
        if (!updated) {
            logger.err(`update for '${table}' failed`, { rows, row })
            this.handleEarlyExit(earlyExit)
        }
        return rows
    }
}

export default new Db()
