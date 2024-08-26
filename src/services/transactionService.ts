import { ethers } from 'ethers'

const provider = new ethers.providers.AlchemyProvider(
  'homestead',
  process.env.ALCHEMY_API_KEY
)

const getTransactionByHash = async (hash: string) => {
  return await provider.getTransaction(hash)
}

export default { getTransactionByHash }
