import puppeteer        from "puppeteer"
import Task             from "../../models/task"
import redis            from "redis"
import { promisify }    from "util"

const subscriber = redis.createClient({ host: process.env.LOCALHOST, port: process.env.REDIS_PORT as unknown as number })

const capture = async (url: string, taskId: string): Promise<void> => 
{   
    const folder    = "./captures/"
    const browser   = await puppeteer.launch()
    const page      = await browser.newPage()
    await page.goto(url) 
    await page.screenshot({ path: folder + taskId + ".png" })
    await browser.close()       
}

const runCapture = async (url: string, taskId: string): Promise<void> => 
{   
    try 
    {
        capture(url, taskId)
        
        await Task.findOneAndReplace(
            { url: url },
            { url: url, image_path: "fs://" + taskId + ".png", task_id: taskId, status: true }
        )           
    } 
    catch (error) 
    {
        throw error
    }    
}

interface IMessage { message: string}
// { url:string, taskId:string }

class Worker 
{
    constructor ()
    {
        subscriber.on("message", (channel:string, rawMessage:string) => 
        {
            const message = JSON.parse(rawMessage)
            runCapture(message.url, message.taskId)
        })

        subscriber.subscribe("notification");
    }
}

export default Worker