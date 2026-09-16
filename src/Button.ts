import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Button',

  add: (world, component) => {
    const {eid} = component

    world.events.addListener(
      eid,
      ecs.input.SCREEN_TOUCH_START,
      () => {
        if (!ecs.Collider.has(world, eid)) {
          return
        }

        if (ecs.Hidden.has(world, eid)) {
          return
        }

        console.log('BUTTON CLICK:', eid)

        world.events.dispatch(
          eid,
          'click'
        )
      }
    )
  },

  remove: () => {},
})