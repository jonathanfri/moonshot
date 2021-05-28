import Task from "../../models/task"
import Workers from "./workers"

const initWatcher = async (): Promise<void> => 
{
    try 
    {  
        const queue = Task.watch()
        const workers = new Workers()

        queue.on("change", async(newTask) => 
        {
            if(newTask.operationType === "insert")
            {
                workers.nextWorker().process(newTask.fullDocument.url, newTask.fullDocument.task_id) 
            }
        });             
    } 
    catch (error) 
    {
      throw error
    }    
}


export { initWatcher }