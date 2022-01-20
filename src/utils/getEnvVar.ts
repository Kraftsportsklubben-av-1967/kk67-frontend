export function getOptionalEnvVar(envVar: string): string | void | boolean {
  return import.meta.env[envVar]
}

export function getEnvVar(envVar: string): string {
  const optionalEnvVar = getOptionalEnvVar(envVar)

  if (!optionalEnvVar || typeof optionalEnvVar !== 'string') {
    throw new Error(`environment variable ${envVar} is required`)
  }

  return optionalEnvVar
}
