import Puppeteer from 'puppeteer'

export class FoodParser {
  /**
   * constructor
   * @param {Puppeteer.ElementHandle<Element>} elementItem
   */
  constructor(elementItem) {
    this.elementItem = elementItem
  }

  async getItem() {
    const isOutOfStock = await this._getIsOutOfStock()

    if (isOutOfStock) {
      return null
    }

    const name = await this._getName()
    const link = await this._getLink()
    const price = await this._getPrice()
    const weightInKg = this._getWeight(name)
    const priceByKg = this._getPriceByKg(price, weightInKg)

    return {
      name,
      link,
      price,
      weightInKg,
      priceByKg,
    }
  }

  _getIsOutOfStock() {
    return this.elementItem.$('.catalog-list-out-of-stock')
  }

  _getName() {
    return this.elementItem.$eval('.catalog-list-name', elem => {
      return elem.innerText
    })
  }

  _getLink() {
    return this.elementItem.$eval('a', element => element.href)
  }

  _getPrice() {
    return this.elementItem.$eval('.catalog-list-price-subscription', element =>
      Number(element.innerText.replace(/[^0-9,]/g, '').replace(',', '.'))
    )
  }

  _getWeight(name) {
    const weightText = name.split('-')[1].split('+')[0].trim()
    const isKilogram = /kg/gi.test(weightText)
    const weight = Number(weightText.replace(/[kg]/gi, '').replace(',', '.'))
    const weightInKg = isKilogram ? weight : weight / 1000

    return weightInKg
  }

  _getPriceByKg(price, kg) {
    return Number((price / kg).toFixed(2))
  }
}
