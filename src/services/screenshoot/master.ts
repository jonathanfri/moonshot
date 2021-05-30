import redis from "redis"
import { promisify } from "util"
import { runWorker } from "./worker"

const redisClient = redis.createClient({ host: process.env.LOCALHOST, port: process.env.REDIS_PORT as unknown as number })
const rpush = promisify(redisClient.rpush).bind(redisClient)

/**
 * distributeTask
 * 
 * The master distrutes work for its workers by adding a new task message to the queue.
 * 
 * @param url 
 * @param taskId 
 */
const distributeTask = async ( url: string, taskId: string ): Promise<void> => 
{
  await rpush("task_queue", JSON.stringify({url: url, taskId: taskId }));
}

/**
 * initWorkers
 * 
 * A initialization method for running worker.
 * 
 * @param workers 
 */
const initWorkers = async (workers:number): Promise<void> => 
{   
  for(let i = 0; i < workers; i++)    
  {
    runWorker()
  }  
}

export { distributeTask, initWorkers }