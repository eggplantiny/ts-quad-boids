import { Vector2 } from '@/entity/Vector2'

export class Blackhole {
  position: Vector2
  radius: number
  shrinkRate: number

  constructor(x: number, y: number, radius: number, shrinkRate = 0.5) {
    this.position = new Vector2(x, y)
    this.radius = radius
    this.shrinkRate = shrinkRate
  }

  update() {
    this.radius -= this.shrinkRate
  }

  isExpired(): boolean {
    return this.radius <= 0
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.radius < 1)
      return

    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx.closePath()
  }
}
