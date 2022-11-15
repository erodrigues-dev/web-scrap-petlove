import fs from 'fs/promises'
import path from 'path'
import url from 'url'

export class PetLoveJsonRepository {
  async saveAll(list) {
    const listSorted = this._sort(list)
    await this._write(listSorted)
  }

  async listByPrice(limit) {
    const database = await this._read()
    const list = JSON.parse(database)
    return list.slice(0, limit)
  }

  _sort(list) {
    return Array.from(list).sort((a, b) => {
      if (a.priceByKg > b.priceByKg) return 1
      if (a.priceByKg < b.priceByKg) return -1
      return 0
    })
  }

  async _write(list) {
    const databasePath = this._getDatabasePath()
    const json = JSON.stringify(list, null, 2)
    await fs.writeFile(databasePath, json, 'utf-8')
  }

  _read() {
    const databasePath = this._getDatabasePath()
    return fs.readFile(databasePath, 'utf-8')
  }

  _getDatabasePath() {
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
    return path.join(__dirname, '/data/data.json')
  }
}
