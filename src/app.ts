import express, { Express }   from "express"
import mongoose               from "mongoose"
import cors                   from "cors"
import taskRoutes             from "./routes"
import { initWorkers }        from "./services/screenshoot/master"

// Initiate Express
const app: Express = express()
app.use(cors())
app.use(taskRoutes)

// Initiate Mongo
// const PORT_MONGO: string | number = process.env.MONGO_PORT || 4000
const uri: string = `mongodb://${process.env.LOCALHOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set("useFindAndModify", false)
mongoose.connect(uri, options)
  .then(() => app.listen(process.env.EXPRESS_PORT, () => console.log(`Server running on http://localhost:${process.env.EXPRESS_PORT}`)))
  .catch(error => { throw error })

initWorkers()