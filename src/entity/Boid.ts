import { Vector2 } from './Vector2'
import type { QuadTree } from './QuadTree'
import { Circle } from './Circle'
import type { Drawable, Updatable } from '@/types/interface.type'
import type { Blackhole } from '@/entity/Blackhole'
import { generateRandomId } from '@/utils/random'
import { Point } from '@/entity/Point'

export class Boid implements Drawable, Updatable {
  position: Vector2
  velocity: Vector2
  acceleration: Vector2
  maxForce: number
  maxSpeed: number
  id: string

  constructor(x: number, y: number) {
    this.position = new Vector2(x, y)
    this.velocity = Vector2.random()
    this.acceleration = new Vector2(0, 0)
    this.maxForce = 0.2
    this.maxSpeed = Math.random() * 10 + 2
    this.id = generateRandomId()
  }

  get point() {
    return new Point(this.id, this.position.x, this.position.y, this)
  }

  // Flock behavior
  flock(quadTree: QuadTree<Boid>, blackholes: Blackhole[]) {
    const alignment = this.align(quadTree)
    const cohesion = this.cohere(quadTree)
    const separation = this.separate(quadTree)
    const blackholeForce = this.attractedToBlackholes(blackholes)

    this.acceleration.add(alignment)
    this.acceleration.add(cohesion)
    this.acceleration.add(separation)
    this.acceleration.add(blackholeForce)
  }

  // Alignment behavior
  align(quadTree: QuadTree<Boid>): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other.id !== this.point.id) {
        steering.add(other.data.velocity)
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
  cohere(quadTree: QuadTree<Boid>): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other.id !== this.id) {
        steering.add(other.data.position)
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
  separate(quadTree: QuadTree<Boid>): Vector2 {
    const perceptionRadius = 50
    const steering = new Vector2(0, 0)
    let total = 0

    // Retrieve nearby boids using QuadTree
    const range = new Circle(this.position.x, this.position.y, perceptionRadius)
    const nearbyBoids = quadTree.query(range)

    for (const other of nearbyBoids) {
      if (other.id !== this.id) {
        const diff = Vector2.subtract(this.position, other.data.position)
        const dist = this.position.distance(other.data.position)

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

  attractedToBlackholes(blackholes: Blackhole[]): Vector2 {
    const force = new Vector2(0, 0)
    for (const blackhole of blackholes) {
      const direction = Vector2.subtract(blackhole.position, this.position)
      const distance = direction.magnitude()
      if (distance < blackhole.radius) {
        direction.normalize()
        const strength = blackhole.radius / distance
        direction.multiply(strength)
        force.add(direction)
      }
    }
    return force
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

  update() {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.acceleration.multiply(0)
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
    ctx.fillStyle = 'rgba(256, 256, 256, 0.75)'
    ctx.fill()
    ctx.restore()
  }
}
