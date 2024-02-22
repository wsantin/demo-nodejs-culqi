
import Logger from './core/Logger';

import { port } from './config';
import app from './app';
import { connectToDb } from './databases/index'

app.listen(process.env.port, async () => {
  await connectToDb().then(async () => {
    Logger.info(`server running on port : ${port}`);
    console.log(`http://127.0.0.1:${process.env.port} is listening...`)
  })
})
.on('error', (e) => Logger.error(e));

  