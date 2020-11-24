import fs from 'fs'
import { dirname, resolve } from 'path'
import yaml from 'js-yaml'

type Nullable<T> = T | undefined

type AppYaml = [key: any] & {
  env_variables?: [key: string]
  includes?: string[]
}

const parseAppYaml = ({
  path,
  encoding,
}: {
  path: string
  encoding: BufferEncoding
}) => {
  const appYaml = fs.readFileSync(path, {
    encoding,
  })

  return yaml.safeLoad(appYaml) as AppYaml
}

const setEnvVariables = (appYaml: AppYaml) => {
  if (appYaml.env_variables == undefined) return

  Object.entries(appYaml.env_variables).map((envVariable) => {
    process.env[envVariable[0]] = envVariable[1]
  })
}

export const config = ({
  path = resolve(process.cwd(), 'app.yaml'),
  encoding = 'utf-8',
}: Nullable<{ path?: string; encoding?: BufferEncoding }> = {}) => {
  const parsedAppYaml = parseAppYaml({ path, encoding })

  setEnvVariables(parsedAppYaml)

  if (parsedAppYaml['includes']) {
    parsedAppYaml['includes'].map((filePath) => {
      const parsedAppYaml = parseAppYaml({
        path: resolve(dirname(path), filePath),
        encoding,
      })

      setEnvVariables(parsedAppYaml)
    })
  }
}
