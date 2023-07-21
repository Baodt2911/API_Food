import jwt from 'jsonwebtoken'
const checkToken = (req, res, next) => {
    const { authorization: token } = req.headers
    if (!token) {
        return res.status(401).json("You're not authenticated")
    }
    const accessToken = token.split(" ")[1]
    jwt.verify(accessToken, process.env.ACCESSTOKEN_KEY, (err, user) => {
        if (err) {
            return res.status(403).json('Token is not valid')
        }
        req.user = user
        next()
    })
}
const checkUser = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.body.userId === req.user.id ||
            req.user.id === req.params.id) {
            next()
        } else {
            res.status(403).json('You are not authorized')
        }
    })
}
const checkAdmin = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.user.role === 'admin' ||
            req.user.role === 'manage'
        ) {
            next()
        } else {
            res.status(403).json('You are not authorized')
        }
    })
}
export { checkToken, checkAdmin, checkUser }