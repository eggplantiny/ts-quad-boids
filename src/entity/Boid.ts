import { Vector2 } from './Vector2'
import type { QuadTree } from './QuadTree'
import { Circle } from './Circle'

export class Boid {
  position: Vector2
  velocity: Vector2
  acceleration: Vector2
  maxForce: number
  maxSpeed: number

  constructor(x: number, y: number) {
    this.position = new Vector2(x, y)
    this.velocity = Vector2.random()
    this.acceleration = new Vector2(0, 0)
    this.maxForce = 0.2
    this.maxSpeed = 4
  }

  // Flock behavior
  flock(quadTree: QuadTree) {
    const alignment = this.align(quadTree)
    const cohesion = this.cohere(quadTree)
    const separation = this.separate(quadTree)

    this.acceleration.add(alignment)
    this.acceleration.add(cohesion)
    this.acceleration.add(separation)
  }

  // Alignment behavior
  align(quadTree: QuadTree): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other !== this) {
        steering.add(other.velocity)
        total++
      }
    }

    if (total > 0) {
      steering.divide(total)
      steering.setMagnitude(this.maxSpeed)
      steering.subtract(this.velocity)
      steering.limit(this.maxForce)
    }

    return steering
  }

  // Cohesion behavior
  cohere(quadTree: QuadTree): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other !== this) {
        steering.add(other.position)
        total++
      }
    }

    if (total > 0) {
      steering.divide(total)
      steering.subtract(this.position)
      steering.setMagnitude(this.maxSpeed)
      steering.subtract(this.velocity)
      steering.limit(this.maxForce)
    }

    return steering
  }

  // Separation behavior
  separate(quadTree: QuadTree): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other !== this) {
        const diff = Vector2.subtract(this.position, other.position)
        const dist = this.position.distance(other.position)

        if (dist < perceptionRadius) {
          // Weight separation force inversely proportional to distance
          diff.divide(dist)
          steering.add(diff)
          total++
        }
      }
    }

    if (total > 0) {
      steering.divide(total)
      steering.setMagnitude(this.maxSpeed)
      steering.subtract(this.velocity)
      steering.limit(this.maxForce)
    }

    return steering
  }

  // Handle Boids going off the edge of the canvas
  edges(width: number, height: number) {
    if (this.position.x > width)
      this.position.x = 0
    if (this.position.x < 0)
      this.position.x = width
    if (this.position.y > height)
      this.position.y = 0
    if (this.position.y < 0)
      this.position.y = height
  }

  // Draw Boid on the canvas
  draw(ctx: CanvasRenderingContext2D) {
    const angle = this.velocity.heading()
    const size = 10

    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(size, 0)
    ctx.lineTo(-size / 2, size / 2)
    ctx.lineTo(-size / 2, -size / 2)
    ctx.closePath()
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
    ctx.fill()
    ctx.restore()
  }
}
