import express from 'express'

/**
 * With express.json(), you parse incoming requests with
 * JSON payloads, which populates the request object with a
 * new body object containing the parsed data.
 */
export default [express.json(), express.urlencoded({ extended: true })]
