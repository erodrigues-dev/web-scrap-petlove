import cron from 'node-cron'
import { PetloveFoodService } from '../service/PetloveFoodService.js'

export class PetloveFoodCron {
  constructor() {
    this.service = new PetloveFoodService()

    this.configs = [
      {
        time: '0 3 * * 1', // At 03:00 on Monday.
        name: 'extract foods',
        handler: () => this._extract(),
      },
      {
        time: '0 9 * * 1', // At 09:00 on Monday.
        name: 'list foods',
        handler: () => this._notifyBetterFoods(),
      },
    ]
  }

  async start() {
    console.log('--------------------------------------------------------')
    console.log('initializing petlove crons')
    this.configs.forEach(config => {
      console.log('--------------------------------------------------------')
      console.log(`schedule cron: ${config.name} time: ${config.time}`)
      cron.schedule(config.time, config.handler)
    })
    console.log('--------------------------------------------------------')
  }

  _extract() {
    console.log('--------------------------------------------------------')
    console.log('extract all foods in PetLove')
    this.service.extractAll()
    console.log('--------------------------------------------------------')
  }

  async _notifyBetterFoods() {
    console.log('--------------------------------------------------------')
    console.log('this is a list of better five foods in PetLove')
    const list = await this.service.getFiveBetterItems()
    console.log(JSON.stringify(list, null, 2))

    // TODO: implement notify by whatsapp

    console.log('--------------------------------------------------------')
  }
}
