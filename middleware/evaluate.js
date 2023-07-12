import { checkToken } from "./auth.js"

const checkUser = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.body.userId === req.user.id) {
            next()
        } else {
            res.status(403).json('You are not authorized')
        }
    })
}
export { checkUser }