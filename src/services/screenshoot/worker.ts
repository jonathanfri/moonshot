import puppeteer        from "puppeteer"
import redis            from "redis"
import { promisify }    from "util"
import { ITask }        from "../../types/task"
import Task             from "../../models/task"

const redisClient = redis.createClient({ host: process.env.LOCALHOST, port: process.env.REDIS_PORT as unknown as number })
const blpopAsync = promisify(redisClient.blpop).bind(redisClient)

/**
 * capture
 * 
 * Captures a screenshot for a url. 
 * 
 * @param url 
 * @param taskId 
 */
const capture = async (url: string, taskId: string): Promise<void> => 
{   
    const folder    = "./captures/"
    const browser   = await puppeteer.launch({ args: ['--disable-dev-shm-usage']})
    const page      = await browser.newPage()
    await page.goto(url) 
    await page.screenshot({ path: folder + taskId + ".png" })
    await browser.close()       
}

/**
 * runWorker
 * 
 * An endless loop that keeps popping items from the queue and processes them. * 
 */
const runWorker = async(): Promise<void> => 
{
    while(true)
    {         
        const raw:string = await blpopAsync("task_queue", 0)
        const message = JSON.parse(raw[1])
        capture(message.url, message.taskId)
        const task: ITask = new Task({ url: message.url, image_path: "fs://" + message.taskId + ".png", task_id: message.taskId, status: true })
        task.save()
    }
}

export { runWorker }