import { Vector2 } from './Vector2'

interface Params {
  position: Vector2
  velocity?: Vector2
  acceleration?: Vector2
  size?: number
  lifeSpan?: number
  color?: string
  onDeath?: () => void
}

export class Particle {
  position: Vector2
  velocity: Vector2
  acceleration: Vector2
  size: number
  lifeSpan: number
  color: string
  onDeath: () => void

  constructor(params: Params) {
    this.position = params.position
    this.velocity = params.velocity ?? new Vector2(0, 0)
    this.acceleration = params.acceleration ?? new Vector2(0, 0)
    this.size = params.size ?? 1
    this.lifeSpan = params.lifeSpan ?? 100
    this.color = params.color ?? 'rgba(255, 255, 255, 1)'
    this.onDeath = params.onDeath ?? (() => {})
  }

  update() {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    this.lifeSpan -= 1
  }

  isExpired(): boolean {
    if (this.lifeSpan <= 0)
      this.onDeath()
    return false
    return true
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
}
