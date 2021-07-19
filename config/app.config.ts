export const DB = {
    type: process.env.DB_TYPE as any || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nest',
};

export const TOKEN = {
    secret: process.env.secret || 'verystrongsecret',
}

export const APP = {
    port: process.env.PORT || 3000,
}