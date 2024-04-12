const packageJson = require('../package.json')
const env = `(${process.env.NODE_ENV.toUpperCase()}) `
module.exports = {
    name: env + packageJson.name,
    version: '0.1.0',
    description: packageJson.description,
    title: env + packageJson.name,
    sampleUrl: true,
    url: process.env.appUrl,
    input: ['example'],
    template: {
        showRequiredLabels: true,
        withCompare: true,
        withGenerator: true,
        aloneDisplay: false,
    },
}
