import {
  Consumer,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
} from "kafkajs"
import { Logger } from "@utils/utils"

class KakfaConsumerFactory<T> {
  private consumer: Consumer
  private topic: string
  private logger: Logger
  private kafkaInstance: Kafka
  private groupId: string

  constructor({
    kafkaService,
    logger,
    topic,
    groupId = "demo-group",
  }: {
    kafkaService: Kafka
    logger: Logger
    topic: string
    groupId: string
  }) {
    this.kafkaInstance = kafkaService
    this.logger = logger
    this.groupId = groupId
    this.topic = topic
    this.consumer = this.createConsumer()
  }

  public async start(consumerFunc: (message: T) => Promise<void>) {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.topic],
      fromBeginning: false,
    }

    try {
      await this.consumer.connect()
      await this.consumer.subscribe(topic)
      this.logger.info(`Kafka consumer for ${this.topic} connected/subscribed.`)
      await this.consumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload

          const msgObj = JSON.parse(message.value?.toString() as string)
          this.logger.info(`Message from ${topic}/${partition}/ ->`, msgObj)

          await consumerFunc(message as T)
        },
      })
    } catch (error) {
      this.logger.error(
        `Error while subscribing consumer to ${this.topic} `,
        error
      )
    }
  }

  private createConsumer(): Consumer {
    return this.kafkaInstance.consumer({ groupId: this.groupId })
  }
}

export default KakfaConsumerFactory
