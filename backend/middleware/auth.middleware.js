import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, Please login to continue" })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("Error in authMiddleware: ", error.message);
        return res
            .status(401)
            .json({ success: false, message: "Cannot find the user, Please register to continue" })
    }
}

export default authMiddleware