import { Logger } from "@utils/utils"
import { Kafka, Message, Producer, ProducerBatch, TopicMessages } from "kafkajs"

class KafkaProducerFactory<T> {
  private producer: Producer
  private topic: string
  private logger: Logger
  private kakfaInstance: Kafka

  constructor({
    topic,
    logger,
    kafkaService,
  }: {
    topic: string
    logger: Logger
    kafkaService: Kafka
  }) {
    this.logger = logger
    this.topic = topic
    this.kakfaInstance = kafkaService
    this.producer = this.createProducer()
    this.start()
  }

  private createProducer() {
    return this.kakfaInstance.producer()
  }

  public async start() {
    try {
      await this.producer.connect()
      this.logger.info(`Kafka producer for ${this.topic} created/connected.`)
    } catch (error) {
      this.logger.error(
        `Error connecting Kafka producer for ${this.topic}: `,
        error
      )
    }
  }

  public async sendMessage(message: T) {
    this.producer
      .send({
        topic: this.topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      })
      .catch((error) => {
        this.logger.error("Error sending Kafka message", message, error)
      })
  }

  async sendBatch(messages: T[]) {
    const kafkaMessages: Message[] = messages.map((message: T) => {
      return { value: JSON.stringify(message) }
    })

    const topicMessages: TopicMessages = {
      topic: this.topic,
      messages: kafkaMessages,
    }

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    }

    await this.producer.sendBatch(batch)
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }
}

export default KafkaProducerFactory
