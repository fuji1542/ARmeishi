import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'CharacterAnimation',

  add: (world, component) => {
    const {eid} = component

    // 最初：idle
    ecs.GltfModel.mutate(world, eid, (cursor) => {
      cursor.animationClip = 'idle'
      cursor.loop = false
      cursor.paused = false
      cursor.time = 0
      cursor.crossFadeDuration = 0.25

      return false
    })

    world.events.addListener(
      eid,
      ecs.events.GLTF_ANIMATION_FINISHED,
      (event) => {
        const name = event.data.name

        // idle → call
        if (name === 'idle') {
          ecs.GltfModel.mutate(world, eid, (cursor) => {
            cursor.animationClip = 'call'
            cursor.loop = false
            cursor.paused = false
            cursor.time = 0
            cursor.crossFadeDuration = 0.25

            return false
          })
        }

        // call → idle LOOP
        else if (name === 'call') {
          ecs.GltfModel.mutate(world, eid, (cursor) => {
            cursor.animationClip = 'idle'
            cursor.loop = true
            cursor.repetitions = -1
            cursor.paused = false
            cursor.time = 0
            cursor.crossFadeDuration = 0.25

            return false
          })
        }
      }
    )
  },

  remove: () => {},
})