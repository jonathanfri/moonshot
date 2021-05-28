import puppeteer from "puppeteer"
import Task from "../../models/task"

class Worker 
{
    idle: boolean = true

    isIdle() : boolean 
    {
        return this.idle
    }

    async capture(url: string, taskId: string): Promise<void>
    {        
        const folder    = "./captures/"
        const browser   = await puppeteer.launch()
        const page      = await browser.newPage()
        await page.goto(url) 
        await page.screenshot({ path: folder + taskId + ".png" })
        await browser.close()   
    }

    async process(url: string, taskId: string): Promise<void>
    {
        try 
        {
            this.idle = false           
            this.capture(url, taskId)
            
            await Task.findOneAndReplace(
                { url: url },
                { url: url, image_path: "fs://" + taskId + ".png", task_id: taskId, status: true }
            )

            this.idle = true
        } 
        catch (error) 
        {
            throw error
        }
    }
}

export default Worker