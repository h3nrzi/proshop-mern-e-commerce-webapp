export class ConfigService {
  get(key: string, fallback?: string): string | undefined {
    const value = process.env[key];
    return value ?? fallback;
  }

  require(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Missing required configuration: ${key}`);
    }
    return value;
  }
}

export default ConfigService;
