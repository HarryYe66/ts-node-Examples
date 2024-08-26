import { Router } from 'express'
import transactionController from '../controllers/transactionController'

const router = Router()

router.get('/transaction/:hash', transactionController.getTransaction)

export default router
