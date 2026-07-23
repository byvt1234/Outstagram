import express from "express"
import { config } from "./config.js"
import { connectDB } from "./101_db/database.js"
import ApiRouter from "./01_router/index.js"
import { errorHandler } from "./102_utils/api/error.middleware.js"
import logger from "./102_utils/log.js";
import morgan from "morgan"
import {currTime} from "./102_utils/time.js";
import cors from "cors"

const app = express()
app.use(
    cors({
        origin: `http://${config.client.address}:${config.client.port}`,
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    })
)

app.use(express.json())
app.use("/api", ApiRouter)

morgan.token("currTime", () => {
    return currTime()
})
app.use(morgan("[:currTime] :http-version :method :url \nstatus\: :status\nremote-addr\: :remote-addr\nrequestContentType\: :req[content-type]\nresponseContentType\::res[content-type]"))

// 정적 파일 경로 열어주기
app.use("/uploads", express.static("00_public/uploads"))

app.use((req, res) => {
    res.sendStatus(404)
})

// ApiError 받아주기
app.use(errorHandler)


connectDB().then(() => {
    app.listen(config.host.port, config.host.address, () => {
        logger("/app.js",
            `Outstagram Server Activate... [origin=http://${config.host.address}:${config.host.port}]`)
        console.log("")
    })
}).catch(console.error)
