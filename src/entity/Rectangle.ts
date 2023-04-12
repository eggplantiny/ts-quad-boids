import type { Point } from './Point'
import { Circle } from './Circle'

export class Rectangle {
  x: number
  y: number
  halfWidth: number
  halfHeight: number

  constructor(x: number, y: number, halfWidth: number, halfHeight: number) {
    this.x = x
    this.y = y
    this.halfWidth = halfWidth
    this.halfHeight = halfHeight
  }

  contains(point: Point): boolean {
    return (point.x >= this.x - this.halfWidth)
      && (point.x <= this.x + this.halfWidth)
      && (point.y >= this.y - this.halfHeight)
      && (point.y <= this.y + this.halfHeight)
  }

  intersects(range: Rectangle | Circle): boolean {
    if (range instanceof Rectangle) {
      return !(range.x - range.halfWidth > this.x + this.halfWidth
        || range.x + range.halfWidth < this.x - this.halfWidth
        || range.y - range.halfHeight > this.y + this.halfHeight
        || range.y + range.halfHeight < this.y - this.halfHeight)
    }
    else if (range instanceof Circle) {
      const deltaX = range.x - Math.max(this.x - this.halfWidth, Math.min(range.x, this.x + this.halfWidth))
      const deltaY = range.y - Math.max(this.y - this.halfHeight, Math.min(range.y, this.y + this.halfHeight))
      return (deltaX * deltaX + deltaY * deltaY) <= (range.radius * range.radius)
    }
    return false
  }
}
