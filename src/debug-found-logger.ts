import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'debug-found-logger',
  add: (world, component) => {
    world.events.addListener(component.eid, 'reality.imagefound', () => {
      console.log('★★★ 認識成功！ Image Target found ★★★', component.eid)
    })
    world.events.addListener(component.eid, 'reality.imagelost', () => {
      console.log('△△△ 見失いました Image Target lost △△△', component.eid)
    })
  },
})