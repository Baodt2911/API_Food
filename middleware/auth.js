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
const checkAdmin = (req, res, next) => {
    checkToken(req, res, () => {
        console.log('Req-checkToken:', req.user.id === req.params.id);
        if (req.user.role === 'admin' ||
            req.user.role === 'manage' ||
            req.user.id === req.params.id
        ) {
            next()
            console.log(true);
        } else {
            res.status(403).json('You are not authorized')
        }
    })
}
export { checkToken, checkAdmin }