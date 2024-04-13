"use strict";

const authModel = require('../models/authModel')
    , bcrypt = require('../libraries/bcryptLib')
    , sendMail = require('../helper/sendEmail')
    , jwtLib = require('../libraries/jwtLib')

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body

            // user exist check
            const user = await authModel.getUserByUsername(username)
            console.log("🚀 ~ login: ~ user:", user)
            if(!user) throw new Error('User is not registred, wanna signup?')

            // validate password
            const passwordMatch = bcrypt.checker(password, user.password)
            if(!passwordMatch) throw new Error('Wrong password')

            // generate token
            const token_session = jwtLib.generate({
                id: user.id,
            })

            // generate refresh token
            const token_refresh = jwtLib.generateRefresh({
                id: user.id,
            })

            // input refresh_token to db
            await authModel.updateUserRefreshToken(user.id, token_refresh)

            res.status(200).json({
                status: 200,
                success: true,
                token_session,
                token_refresh,
                user,
                message: 'You are now logged in'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    },
    getNewToken: async (req, res) => {
        try {
            const user = req.user
            // generate new token
            const token_session = jwtLib.generate({
                id: user.id,
            })

            // generate refresh token
            const token_refresh = jwtLib.generateRefresh({
                id: user.id,
            })

            // input refresh_token to db
            await authModel.updateUserRefreshToken(user.id, token_refresh)

            res.status(200).json({
                status: 200,
                success: true,
                token_session,
                token_refresh,
                message: 'You are now logged in'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    }
}