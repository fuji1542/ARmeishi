import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'PlaySound',

  schema: {
    // @label Sound
    // @asset
    audioUrl: ecs.string,

    // @label Volume
    // @min 0
    // @max 1
    volume: ecs.f32,
  },

  schemaDefaults: {
    audioUrl: '',
    volume: 1.0,
  },

  add: (world, component) => {
    world.events.addListener(
      component.eid,
      'click',
      () => {
        const {audioUrl, volume} = component.schema

        console.log('PLAY SOUND:', audioUrl)

        if (!audioUrl) {
          console.warn('No sound selected')
          return
        }

        const audioEid = world.createEntity()

        ecs.Audio.set(world, audioEid, {
          url: audioUrl,
          volume,
          loop: false,
          paused: false,
          positional: false,
        })

        console.log('AUDIO ENTITY:', audioEid)
      }
    )
  },

  remove: () => {},
})