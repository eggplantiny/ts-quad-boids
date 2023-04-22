export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void
}

export interface Updatable {
  update(): void
}
