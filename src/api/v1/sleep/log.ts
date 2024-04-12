import errorHandling from '@/utils/errorHandling'
import { Request, Response } from 'express'
import app from '@app'
import entry from '@logic/sleep/entry'
import history from '@logic/sleep/history'

export const middlewaresGet = history.validationRules
export const middlewaresPost = entry.validationRules

/**
 * @api {post} /v1/sleep/log Create sleep log
 * @apiVersion 0.1.0
 * @apiGroup Sleep
 * @apiPrivate
 *
 * @apiQuery {String}	name            Name of the person.
 * @apiQuery {String}	gender=Male     Person's gender.
 * @apiQuery {Number}	duration=7      Duration of the sleep.
 * @apiQuery {Date}	    day             Day of the sleep log in `YYYY-MM-DD`.
 *
 * @apiDescription This will create a sleep log entry.
 *
 * @apiSuccessExample Success-Response: HTTP/1.1 200 OK
{
    "record": {
        "name": "Alice Wonderland",
        "gender": "Female",
        "duration": 9,
        "dayDate": "2024-04-09",
        "id": 33
    },
    "duration": {
        "milliseconds": 23.7,
        "seconds": 0,
        "human": "24 ms | a few seconds"
    }
}
 */
export async function post(req: Request, res: Response) {
    errorHandling.handleBadRequestIfNeeded(req)

    const gender: string = req.body.gender
    const name: string = req.body.name
    const duration = Number(req.body.duration)
    const day: string = req.body.day

    const record = await entry.create({ day, duration, gender, name })
    app.ok(req, res, { record })
}

/**
 * @api {get} /v1/sleep/log Get sleep log
 * @apiVersion 0.1.0
 * @apiGroup Sleep
 * @apiPrivate
 *
 * @apiQuery {String}	name            Name of the person.
 * @apiQuery {String}	gender=Male          Person's gender.
 *
 * @apiDescription This will return sleep logs for a given person. The
 * sleep logs returned are limited to last 7 days.
 *
 * @apiSuccessExample Success-Response: HTTP/1.1 200 OK
{
    "logs": [
        {
            "id": 28,
            "name": "Bright Jacob",
            "gender": "Male",
            "duration": 8.7,
            "dayDate": "2024-04-10"
        },
        {
            "id": 30,
            "name": "Bright Jacob",
            "gender": "Male",
            "duration": 8.7,
            "dayDate": "2024-04-05"
        },
        {
            "id": 31,
            "name": "Bright Jacob",
            "gender": "Male",
            "duration": 3,
            "dayDate": "2024-04-07"
        }
    ],
    "duration": {
        "milliseconds": 38.7,
        "seconds": 0,
        "human": "39 ms | a few seconds"
    }
}
 */
export async function get(req: Request, res: Response) {
    errorHandling.handleBadRequestIfNeeded(req)

    const gender: string = req.body.gender
    const name: string = req.body.name

    const logs = await history.moreDetailOfPerson({ gender, name })
    app.ok(req, res, { logs })
}
