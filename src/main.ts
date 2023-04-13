import { App } from '@/app'

function onMounted() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const app = new App(canvas)
  app.init()
  app.initBoids(2000)
  app.updateAndDraw()
}

onMounted()
