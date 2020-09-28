import { Dialect } from 'sequelize/types';

export const config = {
    database: {
        dialect: 'mysql' as Dialect,
        host: '36.89.25.220',
        port: 14306,
        username: 'root',
        password: 'Mjtqs@123',
        database: 'ogyadms',
        //logging: console.log,
        dialectOptions: {
            timezone: 'Etc/GMT+7',
        },
    },
    jwtPrivateKey: 'jwtPrivateKey',
};
