import dotenv from "dotenv";

dotenv.config();

function getString(name, defaultValue = "") {
    return process.env[name]?.trim() || defaultValue;
}

function getNumber(name, defaultValue) {
    const value = process.env[name];

    if (value === undefined || value === "") return defaultValue;

    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
}

function getBoolean(name, defaultValue = false) {
    const value = process.env[name];

    if (value === undefined || value === "") return defaultValue;

    return value === "true";
}

export const env = {
    nodeEnv: getString("NODE_ENV", "development"),
    port: getNumber("PORT", 3000),

    http: {
        jsonBodyLimit: getString("JSON_BODY_LIMIT", "1mb"),
        rateLimitMaxRequests: getNumber("RATE_LIMIT_MAX_REQUESTS", 600)
    },

    cors: {
        clientOrigins: getString("CLIENT_ORIGINS", getString("CORS_ORIGINS", ""))
    },

    database: {
        host: getString("DB_HOST"),
        port: getNumber("DB_PORT"),
        name: getString("DB_NAME"),
        user: getString("DB_USER"),
        password: getString("DB_PASSWORD"),
        ssl: getBoolean("DB_SSL", false),
        sslRejectUnauthorized: getString("DB_SSL_REJECT_UNAUTHORIZED", "true") !== "false"
    },

    auth: {
        jwtSecret: getString("JWT_SECRET"),
        googleClientId: getString("GOOGLE_CLIENT_ID")
    },

    openAi: {
        apiKey: getString("OPENAI_API_KEY"),
        model: getString("OPENAI_MODEL", "gpt-5-nano"),
        maxOutputTokens: getNumber("OPENAI_MAX_OUTPUT_TOKENS", 500)
    },

    aws: {
        region: getString("AWS_REGION", getString("AWS_DEFAULT_REGION", "us-east-1")),
        polly: {
            engine: getString("AWS_POLLY_ENGINE", "neural"),
            voiceId: getString("AWS_POLLY_VOICE_ID", "Enrique"),
            outputFormat: getString("AWS_POLLY_OUTPUT_FORMAT", "mp3"),
            sampleRate: getString("AWS_POLLY_SAMPLE_RATE", "24000"),
            maxChars: getNumber("AWS_POLLY_MAX_CHARS", 2500)
        }
    }
};

export const isProduction = env.nodeEnv === "production";