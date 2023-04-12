import { Blackhole } from '@/entity/Blackhole'
import { Boid } from '@/entity/Boid'
import { QuadTree } from '@/entity/QuadTree'
import { Rectangle } from '@/entity/Rectangle'

export class App {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  quadTree: QuadTree<Boid>
  width: number
  height: number
  boids: Boid[]
  blackholes: Blackhole[]

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.width = canvas.width
    this.height = canvas.height
    this.boids = []
    this.blackholes = []
    this.quadTree = new QuadTree(new Rectangle(this.width / 2, this.height / 2, this.width / 2, this.height / 2), 4)
  }

  public init() {
    this.resize()
    window.addEventListener('resize', () => this.resize())

    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) * 2
      const y = (event.clientY - rect.top) * 2
      const blackhole = new Blackhole(x, y, 100, 1)
      this.blackholes.push(blackhole)
    })
  }

  private resize() {
    this.canvas.width = window.innerWidth * 2
    this.canvas.height = window.innerHeight * 2
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.quadTree = new QuadTree(new Rectangle(this.width / 2, this.height / 2, this.width / 2, this.height / 2), 4)
  }

  // Boids 생성 및 초기화 메소드
  initBoids(n: number) {
    for (let i = 0; i < n; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      this.boids.push(new Boid(x, y))
    }
  }

  // Boids 알고리즘 실행 및 시각화
  updateAndDraw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.quadTree = new QuadTree(new Rectangle(this.width / 2, this.height / 2, this.width / 2, this.height / 2), 4)

    for (const boid of this.boids)
      this.quadTree.insert(boid.point)

    for (const boid of this.boids) {
      boid.flock(this.quadTree, this.blackholes)
      boid.update()
      boid.edges(this.width, this.height)
      boid.draw(this.ctx)
    }

    for (const blackhole of this.blackholes) {
      blackhole.update()
      blackhole.render(this.ctx)
    }

    this.blackholes = this.blackholes.filter(blackhole => !blackhole.isExpired())

    requestAnimationFrame(() => this.updateAndDraw())
  }
}
