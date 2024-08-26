import { Request, Response } from 'express'
import transactionService from '../services/transactionService'

const getTransaction = async (req: Request, res: Response) => {
  const hash = req.params.hash
  const transaction = await transactionService.getTransactionByHash(hash)
  res.json(transaction)
}

export default { getTransaction }
