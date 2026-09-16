import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'ShowObject',

  schema: {
    // @label Target Object 1
    target1: ecs.eid,

    // @label Target Object 2
    target2: ecs.eid,

    // @label Target Object 3
    target3: ecs.eid,

    // @label Target Object 4
    target4: ecs.eid,

    // @label Target Object 5
    target5: ecs.eid,

    // @label Display Mode
    // @enum 表示, 非表示, トグル切り替え
    displayMode: ecs.string,

    // @label Hide Button
    hideButton: ecs.boolean,
  },

  schemaDefaults: {
    displayMode: 'トグル切り替え',
    hideButton: false,
  },

  add: (world, component) => {
    const {eid} = component

    world.events.addListener(
      eid,
      'click',
      () => {
        const {
          target1,
          target2,
          target3,
          target4,
          target5,
          displayMode,
          hideButton,
        } = component.schema

        const targets = [
          target1,
          target2,
          target3,
          target4,
          target5,
        ]

        for (const target of targets) {
          if (!target) {
            continue
          }

          if (displayMode === '表示') {
            ecs.Hidden.remove(world, target)

            console.log('SHOW OBJECT')
          }

          else if (displayMode === '非表示') {
            ecs.Hidden.set(world, target, {})

            console.log('HIDE OBJECT')
          }

          else if (displayMode === 'トグル切り替え') {
            if (ecs.Hidden.has(world, target)) {
              ecs.Hidden.remove(world, target)

              console.log('SHOW OBJECT')
            } else {
              ecs.Hidden.set(world, target, {})

              console.log('HIDE OBJECT')
            }
          }
        }

        // ボタン自身を非表示
        if (hideButton) {
          ecs.Hidden.set(world, eid, {})
        }
      }
    )
  },

  remove: () => {},
})