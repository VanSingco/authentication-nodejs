module.exports = {
    database: process.env.DATABASE || 'your mongoDBName',
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'your secret',
    auth: {
        user: 'your email',
        pass: '09103607533'
    },
    facebook: {
        clientID: 'your facebookClientID',
        clientSecret: 'your facebookClientSecret'
    },
    google: {
        clientID: 'your GoogleClientID',
        clientSecret: 'your GoogleSecretID'
    }
}