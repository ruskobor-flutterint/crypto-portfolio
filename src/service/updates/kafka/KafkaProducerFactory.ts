import { Logger } from "@utils/utils"
import { Kafka, Producer } from "kafkajs"

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

  public sendBatch(message: T[]) {}

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }
}

export default KafkaProducerFactory
