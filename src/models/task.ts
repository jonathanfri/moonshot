import { ITask } from "../types/task"
import { model, Schema } from "mongoose"

const taskSchema: Schema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    image_path: {
      type: String,
      required: false,
    },

    task_id: {
      type: String,
      required: false,
    },

    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

export default model<ITask>("Task", taskSchema)