import { PetloveGetFoodIntegration } from '../integration/PetloveGetFoodIntegration.js'
import { PetLoveJsonRepository } from '../repository/PetloveFoodJsonRepository.js'

export class PetloveFoodService {
  constructor() {
    this.integration = new PetloveGetFoodIntegration()
    this.repository = new PetLoveJsonRepository()
  }

  async extractAll() {
    console.log('listing all foods')
    const all = await this.integration.list()
    console.log('save foods')
    await this.repository.saveAll(all)
  }

  getFiveBetterItems() {
    return this.repository.listByPrice(5)
  }
}
