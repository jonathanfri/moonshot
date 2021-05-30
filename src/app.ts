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
const uri: string = `mongodb://${process.env.LOCALHOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.set("useFindAndModify", false)
mongoose.connect(uri, options)
  .then(
    () => app.listen(process.env.EXPRESS_PORT, 
    () => console.log(`Server running on http://${process.env.LOCALHOST}:${process.env.EXPRESS_PORT}`))
  )
  .catch(error => { throw error })

// Create workers
initWorkers(process.env.WORKERS as unknown as number)