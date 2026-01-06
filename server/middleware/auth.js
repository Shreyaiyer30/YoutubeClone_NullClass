// import jwt from 'jsonwebtoken'

// const auth =(req,res,next)=>{
//     try {
//         const token = req.headers.authorization.split(" ")[1];

//         let decodeData= jwt.verify(token,process.env.JWT_SECRET)
//          req.userId=decodeData?.id
//         next();        
//     }catch(error){
//         res.status(400).json("Invalid Creadentials");
//     }
// }
// export default auth

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error("❌ Token verification error:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const checkAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    next();
};