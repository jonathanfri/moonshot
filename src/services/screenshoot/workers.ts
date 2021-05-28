import Worker from "./worker"

class Workers
{
    workers: Array<Worker> = []   

    nextWorker()
    {
        this.workers.forEach((worker) => 
        {
            if(worker.isIdle())
            {
                return worker
            }
        })

        const worker = new Worker()
        this.workers.push(worker)
        return worker
    }    
}

export default Workers