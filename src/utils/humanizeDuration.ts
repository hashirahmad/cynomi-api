import moment from 'moment'

function humanizeDuration(durationInMs: number): string {
    let r = ''
    const seconds = durationInMs / 1000
    if (seconds < 1) {
        r = `${durationInMs.toFixed(0)} ms`
    } else if (seconds < 60) {
        r = `${seconds.toFixed(0)} seconds`
    } else {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        r = `${minutes} minute${
            minutes > 1 ? 's' : ''
        } and ${remainingSeconds.toFixed(0)} seconds`
    }

    return `${r} | ${moment.duration(durationInMs).humanize()}`
}

export default humanizeDuration
