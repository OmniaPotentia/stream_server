const {Router} = require('express');
const UserService = require('../../services/UserService');
const {HTTP_OK, HTTP_NOT_FOUND} = require("../../ConstantVariables/HTTP_STATUS_CODES");

const router = Router();

module.exports = () => {
    router.get('/userlist', async (req, res, next) => {
        try {
            const users = await UserService.getList();
            if (users && users.length && users.length > 0) {
                const userList = await Promise.all(
                    users.map(async (user) => {
                        const userJson = user.toJSON();
                        const resetToken = await UserService.getResetToken(user.id);
                        if (resetToken && resetToken.token) {
                            userJson.resetToken = resetToken.token;
                        }
                        return userJson;
                    })
                );

                return res.status(HTTP_OK).json(
                    {userList: userList}
                );
            } else {
                return res.status(HTTP_NOT_FOUND).send('No user found')
            }
        } catch (err) {
            return next(err);
        }
    });
    router.get('/userlist/:userID', async (req, res, next) => {
        try {
            const user = await UserService.findById(req.params.userID);
            if (user) {
                return res.status(HTTP_OK).json(
                    {userList: user}
                );
            } else {
                return res.status(HTTP_OK).send('No user found')
            }
        } catch (err) {
            return next(err);
        }
    });
    return router;
};
