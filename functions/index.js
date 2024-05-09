const functions =  require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, _) => {
    // get user and give him a custom claim (isAdmin claim)
    return admin.auth().getUserByEmail(data.email)
        .then((user) => {
            return admin.auth().setCustomUserClaims(user.uid, {isAdmin: true})
        })
        .then(() => {
            return {
                message: `Success! ${data.email} has beed made an admin.`
            }
        })
        .catch((err) => {
            return err
        })
})