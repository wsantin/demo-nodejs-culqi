import { connectToRedis } from './redis'

export const connectToDb = async () => {
    await connectToRedis()
}