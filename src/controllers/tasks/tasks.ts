import { Response, Request }    from "express"
import { v4 as uuidv4 }         from "uuid"
import redis                    from "redis"
import { promisify }            from "util"
import { distributeTask }       from "../../services/screenshoot/master"

const cache = redis.createClient({ host: process.env.LOCALHOST, port: process.env.REDIS_PORT as unknown as number })
const getAsync = promisify(cache.get).bind(cache)
const setAsync = promisify(cache.set).bind(cache)

const saveScreenshot = async (req: Request, res: Response): Promise<void> => 
{
    try 
    { 
        const url: string = req.query.url as string   

        if(!cache.exists(url))
        {
            const taskId: string = await getAsync(url) as string
            res.status(200).json({ url: url, taskId: taskId })            
        }        
        else
        {
            const taskId: string = uuidv4()
           
            await setAsync(url, taskId)
            distributeTask(url, taskId)
            
            res.status(200).json({ url: url, taskId: taskId })
        }
    } 
    catch (error) 
    {
      throw error
    }
}

export { saveScreenshot }