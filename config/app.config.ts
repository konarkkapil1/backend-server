export const DB = {
    type: process.env.DB_TYPE as any || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nest',
};

export const TOKEN = {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'verystrongaccesstokensecret',
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'verystrongrefreshtokensecret',
    token_issuer: process.env.TOKEN_ISSUER || 'localhost',
}

export const APP = {
    port: process.env.PORT || 3000,
}