import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'CubeAnimation',

  schema: {
    // @label Target Object 1
    target1: ecs.eid,

    // @label Target Object 2
    target2: ecs.eid,

    // @label Target Object 3
    target3: ecs.eid,

    // @label Target Object 4
    target4: ecs.eid,
  },

  schemaDefaults: {},

  add: (world, component) => {
    const {eid} = component

    let canClick = false
    let fallPlayed = false

    // マーカー認識
    world.events.addListener(
      world.events.globalId,
      ecs.events.REALITY_IMAGE_FOUND,
      () => {
        // 2回目以降は何もしない
        if (fallPlayed) {
          console.log('FALL ALREADY PLAYED')
          return
        }

        fallPlayed = true
        canClick = false

        console.log('IMAGE FOUND')
        console.log('FALL START')

        ecs.GltfModel.mutate(world, eid, (cursor) => {
          cursor.animationClip = 'Fall'
          cursor.loop = false
          cursor.paused = false
          cursor.time = 0
          cursor.crossFadeDuration = 0

          return false
        })
      }
    )

    // Cubeクリック
    world.events.addListener(
      eid,
      'click',
      () => {
        if (!canClick) {
          console.log('CUBE LOCKED: Fall is playing')
          return
        }

        console.log('CUBE CLICK')

        // Collider削除
        ecs.Collider.remove(world, eid)

        console.log(
          'CUBE COLLIDER AFTER REMOVE:',
          ecs.Collider.has(world, eid)
        )

        // Open再生
        ecs.GltfModel.mutate(world, eid, (cursor) => {
          cursor.animationClip = 'Open'
          cursor.loop = false
          cursor.paused = false
          cursor.time = 0
          cursor.crossFadeDuration = 0.2

          return false
        })

        canClick = false
      }
    )

    // アニメーション終了
    world.events.addListener(
      eid,
      ecs.events.GLTF_ANIMATION_FINISHED,
      (event) => {
        const name = event.data.name

        console.log('Animation finished:', name)

        // Fall終了
        if (name === 'Fall') {
          console.log('FALL FINISHED')

          const target1 = component.schema.target1

          if (target1) {
            ecs.Hidden.remove(world, target1)
            console.log('TARGET1 SHOW')
          }

          canClick = true

          return
        }

        // Open終了
        if (name === 'Open') {
          console.log('OPEN FINISHED')

          const target2 = component.schema.target2
          if (target2) {
            ecs.Hidden.remove(world, target2)
            console.log('TARGET2 SHOW')
          }

          const target3 = component.schema.target3
          if (target3) {
            ecs.Hidden.remove(world, target3)
            console.log('TARGET3 SHOW')
          }

          const target4 = component.schema.target4

          if (target4) {
            ecs.Hidden.remove(world, target4)

            ecs.GltfModel.mutate(world, target4, (cursor) => {
              cursor.animationClip = 'Posterアクション'
              cursor.loop = false
              cursor.paused = false
              cursor.time = 0
              cursor.crossFadeDuration = 0

              return false
            })

            console.log('TARGET4 SHOW + POSTER ANIMATION')
          }

          console.log('TARGET2-4 SHOW')
        }
      }
    )
  },

  remove: () => {},
})