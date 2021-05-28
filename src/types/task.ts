import { Document } from "mongoose"

export interface ITask extends Document 
{
  url:          string
  image_path:   string
  task_id:      string
  status:       boolean
}