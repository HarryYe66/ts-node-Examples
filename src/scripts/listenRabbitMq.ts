// src/RabbitMQ/server.ts
import RabbitMQManager from '../config/rabbitmq'

const RabbitMQ = new RabbitMQManager()

// 消费 RabbitMQ 消息，根据操作执行不同的方法
async function consumeMessages() {
  await RabbitMQ.connectQueue()

  RabbitMQ.consumeQueue(async (operation: Express.RabbitMessages) => {
    try {
      switch (operation.action) {
        case 'creation_user':
          console.log('creation_user', operation)

          break

        // 可以添加其他操作的处理逻辑
        default:
          console.log('Unhandled operation:', operation)
          break
      }
    } catch (error) {
      console.error('Error processing message:', error)
    }
  })
}

export default consumeMessages

// consumeMessages().catch((error) => {
//   console.error('Failed to consume messages from RabbitMQ:', error)
// })
