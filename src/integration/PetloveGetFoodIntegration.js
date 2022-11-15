import puppeteer from 'puppeteer'
import { FoodParser } from '../parser/FoodParser.js'

export class PetloveGetFoodIntegration {
  async list() {
    let browser
    try {
      browser = await this._initializeBrowser()
      const page = await browser.newPage()
      return await this._listAll(page)
    } catch (error) {
      throw error
    } finally {
      await browser.close()
    }
  }

  _initializeBrowser() {
    console.log('initializing browser')
    return puppeteer.launch()
  }

  async _listAll(page) {
    console.log('listing all items')
    let pageNumber = 1
    const result = []
    while (true) {
      console.log('starting loop')
      await this._loadPage(page, pageNumber)
      const items = await this._getItems(page)
      console.log(`found ${items.length} items in loop`)
      console.log(`found total items: ${items.length + result.length}`)
      if (items.length === 0) break

      result.push(...items)
      pageNumber++
      console.log('increment page')
    }

    return result
  }

  _loadPage(page, pageNumber) {
    console.log(`loading page: ${pageNumber}`)
    const url = this._makeUrl(pageNumber)
    return page.goto(url)
  }

  _makeUrl(pageNumber) {
    return `https://www.petlove.com.br/cachorro/racoes/racao-seca/corante_sem%20corante?results_per_page=36&sort=6&page=${pageNumber}`
  }

  /**
   * @param {puppeteer.Page} page
   */
  async _getItems(page) {
    console.log('gettings items')
    const items = await page.$$('.catalog-list-item')
    if (items.length === 0) return []

    const results = []
    for (const item of items) {
      console.log('parsing item')
      const parser = new FoodParser(item)
      const data = await parser.getItem()
      if (data) {
        results.push(data)
      }
    }

    return results
  }
}
