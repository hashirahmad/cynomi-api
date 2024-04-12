export function sleep(s: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, s * 1000)
    })
}
