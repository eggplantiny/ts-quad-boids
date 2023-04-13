import { Vector2 } from '@/entity/Vector2'

export class Blackhole {
  position: Vector2
  radius: number
  shrinkRate: number
  color: string

  constructor(x: number, y: number, radius: number, shrinkRate = 0.5) {
    this.position = new Vector2(x, y)
    this.radius = radius
    this.shrinkRate = shrinkRate
    this.color = `rgba(100, 100, 100, ${Math.random() * 0.5 + 0.5})`
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

    const gradient = ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      0,
      this.position.x,
      this.position.y,
      this.radius,
    )

    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient

    ctx.fill()
    ctx.closePath()
  }
}
