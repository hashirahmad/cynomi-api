import errorHandling from '@/utils/errorHandling'
import { Request, Response } from 'express'
import app from '@app'
import history from '@logic/sleep/history'

export const middlewares = []

/**
 * @api {get} /v1/sleep/entries Get sleep log entries
 * @apiVersion 0.1.0
 * @apiGroup Sleep
 * @apiPrivate
 *
 * @apiDescription This will return sleep logs entries per person of everybody.
 *
 * @apiSuccessExample Success-Response: HTTP/1.1 200 OK
{
    "sleepEntries": [
        {
            "entries": 1,
            "name": "John Block",
            "gender": "Male"
        },
        {
            "entries": 12,
            "name": "Ben Abraham",
            "gender": "Male"
        },
        {
            "entries": 6,
            "name": "Joe Wright",
            "gender": "Male"
        },
        {
            "entries": 6,
            "name": "Paul Walker",
            "gender": "Male"
        },
        {
            "entries": 4,
            "name": "Bright Jacob",
            "gender": "Male"
        },
        {
            "entries": 1,
            "name": "Alice Wonderland",
            "gender": "Female"
        }
    ],
    "duration": {
        "milliseconds": 7.1,
        "seconds": 0,
        "human": "7 ms | a few seconds"
    }
}
 */
export async function get(req: Request, res: Response) {
    errorHandling.handleBadRequestIfNeeded(req)

    const sleepEntries = await history.entriesPerPerson()
    app.ok(req, res, { sleepEntries })
}
