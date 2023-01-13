import * as functions from 'firebase-functions'
const express = require('express')

export const createUserApp = express();

createUserApp.post("/", async (req, res) => {
    functions.logger.debug('Calling create user function');
    try {
        res.status(200).json({
            message: 'User created successfully'
        })
    } catch(err){
        functions.logger.debug('Could not create user', err);
        res.status(500).json({
            message: 'could not create user'
        })
    }
})
