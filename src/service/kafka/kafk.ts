import { Kafka } from "kafkajs"

class KafkaService {
  private kafka: Kafka
  private producer: any
  private consumer: any

  constructor() {
    this.kafka = new Kafka({
      clientId: "my-app",
      brokers: ["localhost:9092"],
    })
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: "test-group" })
  }

  async connect() {
    await this.producer.connect()
    await this.consumer.connect()
  }

  async disconnect() {
    await this.producer.disconnect()
    await this.consumer.disconnect()
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    })
  }
}

export default KafkaService
