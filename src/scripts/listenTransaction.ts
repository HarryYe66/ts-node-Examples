import { ethers } from 'ethers'
import '../src/config/dotenv'

const provider = new ethers.providers.AlchemyProvider(
  'homestead',
  process.env.ALCHEMY_API_KEY
)
const transactionHash = 'YOUR_TRANSACTION_HASH'

const checkTransactionStatus = async (txHash: string) => {
  try {
    const receipt = await provider.waitForTransaction(txHash)
    if (receipt) {
      console.log('Transaction was mined in block:', receipt.blockNumber)
      console.log('Transaction status:', receipt.status ? 'Success' : 'Failed')
      console.log('Gas used:', receipt.gasUsed.toString())
      console.log('Transaction logs:', receipt.logs)
    }
  } catch (error) {
    console.error('Error fetching transaction receipt:', error)
  }
}

checkTransactionStatus(transactionHash)
