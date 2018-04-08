import dotenv from 'dotenv'
const env = process.env.NODE_ENV || 'development'

if (env != 'production'){
  
  dotenv.config({silent: true})
}

const globalConfig = {
  NODE_ENV: env,
  LINE_CHANNEL_ACCESS_TOKEN: getEnv('LINE_CHANNEL_ACCESS_TOKEN') || '',
  LINE_CHANNEL_SECRET: getEnv('LINE_CHANNEL_SECRET') || ''
}

const localConfig = {

  development: {

  },

  test: {

  },

  production: {

  }
}[env]

const config = Object.assign({ }, globalConfig, localConfig)
console.log(`Loaded config: '${env}'`)

function getEnv (envVar) {
  return process.env[`${envVar}`]
}

export default config