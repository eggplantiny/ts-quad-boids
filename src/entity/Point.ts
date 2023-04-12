export class Point<Data> {
  x: number
  y: number
  data: Data
  id: string

  constructor(id: string, x: number, y: number, data: Data) {
    this.id = id
    this.x = x
    this.y = y
    this.data = data
  }
}
