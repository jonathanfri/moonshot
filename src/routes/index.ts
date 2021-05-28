import { Router } from "express"
import { saveScreenshot } from "../controllers/tasks/tasks"

const router: Router = Router()

router.get("/capture", saveScreenshot)

export default router