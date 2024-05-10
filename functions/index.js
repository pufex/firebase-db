const functions =  require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, _) => {
    return admin.auth().getUserByEmail(data.email)
        .then((user) => {
            return admin.auth().setCustomUserClaims(user.uid, {isAdmin: true})
        })
        .then(() => {
            return {
                message: `Success! ${data.email} has been made an admin.`
            }
        })
        .catch((err) => {
            return err
        })
})

exports.banUserWithEmail = functions.https.onCall((data, _) => {
    return admin.auth().getUserByEmail(data.email)
        .then((user) => {
            return admin
                .auth()
                .setCustomUserClaims(
                    user.uid, {isBanned: true,}
                )
                    .then(() => user)
        })
        .catch((err) => {
            return err;
        })
})