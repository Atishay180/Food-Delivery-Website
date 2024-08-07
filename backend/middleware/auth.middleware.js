import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if(!token) {
        return res.json({success: false, message: "Not Authorized, Please Login Again"})
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("Cannot get the token");
        res.json({success: false, message: "Cannot get the token"})
    }
}

export default authMiddleware