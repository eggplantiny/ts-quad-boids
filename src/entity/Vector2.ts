export // src/Vector2.ts

class Vector2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // Add a vector to this vector
  add(v: Vector2) {
    this.x += v.x
    this.y += v.y
  }

  // Subtract a vector from this vector
  subtract(v: Vector2) {
    this.x -= v.x
    this.y -= v.y
  }

  // Multiply this vector by a scalar value
  multiply(scalar: number) {
    this.x *= scalar
    this.y *= scalar
  }

  // Divide this vector by a scalar value
  divide(scalar: number) {
    this.x /= scalar
    this.y /= scalar
  }

  // Calculate the magnitude of this vector
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  // Set the magnitude of this vector
  setMagnitude(magnitude: number) {
    const currentMagnitude = this.magnitude()
    if (currentMagnitude > 0)
      this.multiply(magnitude / currentMagnitude)
  }

  // Limit the magnitude of this vector
  limit(max: number) {
    if (this.magnitude() > max)
      this.setMagnitude(max)
  }

  // Calculate the distance between this vector and another vector
  distance(v: Vector2): number {
    const dx = this.x - v.x
    const dy = this.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Calculate the angle of this vector
  heading(): number {
    return Math.atan2(this.y, this.x)
  }

  // Static methods

  // Create a new vector with random x and y components
  static random(): Vector2 {
    return new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1)
  }

  // Add two vectors and return a new vector
  static add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y)
  }

  // Subtract one vector from another and return a new vector
  static subtract(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y)
  }

  // Multiply a vector by a scalar value and return a new vector
  static multiply(v: Vector2, scalar: number): Vector2 {
    return new Vector2(v.x * scalar, v.y * scalar)
  }

  // Divide a vector by a scalar value and return a new vector
  static divide(v: Vector2, scalar: number): Vector2 {
    return new Vector2(v.x / scalar, v.y / scalar)
  }
}
