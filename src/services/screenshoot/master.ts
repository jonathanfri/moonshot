import redis from "redis"
import Worker from "./worker"

const publisher = redis.createClient({ host: process.env.LOCALHOST, port: process.env.REDIS_PORT as unknown as number })

const distributeTask = async ( url: string, taskId: string ): Promise<void> => 
{
    try 
    {  
        publisher.publish("notification", JSON.stringify({url: url, taskId: taskId }))      
    } 
    catch (error) 
    {
      throw error
    }    
}

const WORKERS:number = 2

const initWorkers = async (): Promise<void> => 
{
    try 
    {  
        for(let i = 0; i < WORKERS; i++)    
        {
          new Worker()
        }
    } 
    catch (error) 
    {
      throw error
    }    
}

export { distributeTask, initWorkers }