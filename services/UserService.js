const crypto = require('crypto');

const UserModel = require('../models/UserModel');
const PasswordResetModel = require('../models/ResetTokenModel');
const ResetTokenModel = require('../models/ResetTokenModel');

class UserService {

    static async findByEmail(email) {
        return UserModel.findOne({email}).exec();
    }

    static async findByMobileNumber(mobileNumber) {
        return UserModel.findOne({mobileNumber}).exec();
    }

    static async findByUsername(username) {
        return UserModel.findOne({username}).exec();
    }

    static async createUser(firstName, lastName, email, password, phoneNumber) {
        const user = new UserModel();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.mobileNumber = phoneNumber;
        return await user.save();
    }

    static async changeStatus(user, userStatus, email, mobileNumber) {
        if (email) await UserModel.findOneAndUpdate({'email': user}, {'$set': {activeStatus: userStatus}}, {upsert: false});
        else if (mobileNumber) await UserModel.findOneAndUpdate({'mobileNumber': user}, {'$set': {activeStatus: userStatus}}, {upsert: false});
        else await UserModel.findOneAndUpdate({'username': user}, {'$set': {activeStatus: userStatus}}, {upsert: false});
    }

    static async createGoogleUser(username, email, oauthProfile) {
        const user = new UserModel();
        user.email = email;
        user.oauthprofiles = [oauthProfile];
        user.password = crypto.randomBytes(10).toString('hex');
        user.username = username;
        const savedUser = await user.save();
        return savedUser;
    }

    static async createPasswordResetToken(userId) {
        const passwordReset = new PasswordResetModel();
        passwordReset.userId = userId;
        const savedToken = await passwordReset.save();
        return savedToken.token;
    }

    static async verifyPasswordResetToken(userId, token) {
        return PasswordResetModel.findOne({
            token, userId,
        }).exec();
    }

    static async deletePasswordResetToken(token) {
        return PasswordResetModel.findOneAndDelete({
            token,
        }).exec();
    }

    static async changePassword(userId, password) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.password = password;
        return user.save();
    }

    static async findById(id) {
        return UserModel.findById(id).exec();
    }

    static async findByOAuthProfile(provider, profileId) {
        return UserModel.findOne({
            oauthprofiles: {$elemMatch: {provider, profileId}},
        }).exec();
    }

    static async getResetToken(userId) {
        return ResetTokenModel.findOne({userId}).exec();
    }

    static async getList() {
        return UserModel.find().sort({createdAt: -1}).exec();
    }

    static async deleteUser(id) {
        return UserModel.findByIdAndDelete(id);
    }

    static async addUserName(user, username) {
        await UserModel.findOneAndUpdate({'email': user}, {$set: {"username": username}}, {upsert: false});
    }

    static validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    static validatePhoneNumber(mobileNumber) {
        const isMobileNumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

        return isMobileNumber.test(mobileNumber);
    }
}

module.exports = UserService;
