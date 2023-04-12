import { Rectangle } from './Rectangle'
import { Circle } from './Circle'
import type { Point } from './Point'

export class QuadTree {
  boundary: Rectangle
  capacity: number
  points: Point[]
  divided: boolean
  northWest: QuadTree | null
  northEast: QuadTree | null
  southWest: QuadTree | null
  southEast: QuadTree | null

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary
    this.capacity = capacity
    this.points = []
    this.divided = false
    this.northWest = null
    this.northEast = null
    this.southWest = null
    this.southEast = null
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point))
      return false

    if (this.points.length < this.capacity) {
      this.points.push(point)
      return true
    }

    if (!this.divided)
      this.subdivide()

    return (this.northWest!.insert(point) || this.northEast!.insert(point)
      || this.southWest!.insert(point) || this.southEast!.insert(point))
  }

  subdivide() {
    const x = this.boundary.x
    const y = this.boundary.y
    const hw = this.boundary.halfWidth
    const hh = this.boundary.halfHeight

    const nwBoundary = new Rectangle(x - hw / 2, y - hh / 2, hw / 2, hh / 2)
    this.northWest = new QuadTree(nwBoundary, this.capacity)
    const neBoundary = new Rectangle(x + hw / 2, y - hh / 2, hw / 2, hh / 2)
    this.northEast = new QuadTree(neBoundary, this.capacity)
    const swBoundary = new Rectangle(x - hw / 2, y + hh / 2, hw / 2, hh / 2)
    this.southWest = new QuadTree(swBoundary, this.capacity)
    const seBoundary = new Rectangle(x + hw / 2, y + hh / 2, hw / 2, hh / 2)
    this.southEast = new QuadTree(seBoundary, this.capacity)

    this.divided = true
  }

  query(range: Rectangle | Circle, found: Point[] = []): Point[] {
    if (!this.boundary.intersects(range))
      return found

    for (const point of this.points) {
      if (range instanceof Rectangle) {
        if (range.contains(point))
          found.push(point)
      }
      else if (range instanceof Circle) {
        const d = Math.sqrt((point.x - range.x) ** 2 + (point.y - range.y) ** 2)
        if (d <= range.radius)
          found.push(point)
      }
    }

    if (this.divided) {
      this.northWest!.query(range, found)
      this.northEast!.query(range, found)
      this.southWest!.query(range, found)
      this.southEast!.query(range, found)
    }

    return found
  }
}
