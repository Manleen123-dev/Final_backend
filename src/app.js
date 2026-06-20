import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/apierror.js"
import { ApiResponse } from "./utils/apiResponse.js"
const app=express()

const allowedOrigins = process.env.CORS_ORIGIN
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || []

app.use(cors({
    origin(origin, callback) {
        if (
            !origin ||
            allowedOrigins.length === 0 ||
            allowedOrigins.includes("*") ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true)
        }

        return callback(new ApiError(403, "Not allowed by CORS"))
    },
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
import userRouter from './routes/user.router.js'

//routes declaration

app.get("/api/v1/health", (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, {
            service: "Final_project API",
            status: "ok"
        }, "API is healthy"))
})

app.use("/api/v1/users",userRouter)

app.use((req, res) => {
    return res
        .status(404)
        .json(new ApiError(404, `Route ${req.originalUrl} not found`))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500

    return res
        .status(statusCode)
        .json({
            statusCode,
            data: err.data || null,
            success: false,
            message: err.message || "Internal server error",
            errors: err.errors || []
        })
})


export {app}
