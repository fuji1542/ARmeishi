import * as ecs from '@8thwall/ecs'

const GoToURL = ecs.registerComponent({
  name: 'GoToURL',

  schema: {
    // @label URL
    url: ecs.string,
  },

  schemaDefaults: {
    url: '',
  },

  add: (world, component) => {
    const {eid} = component

    // 起動時の確認
    const initial = GoToURL.get(world, eid)

    console.log(
      'GOTO READY:',
      eid,
      initial.url
    )

    world.events.addListener(
      eid,
      'click',
      () => {
        console.log('GOTO CLICK:', eid)

        // ★クリック時に現在のComponentデータを取得
        const current = GoToURL.get(world, eid)

        console.log(
          'GOTO URL:',
          current.url
        )

        if (ecs.Hidden.has(world, eid)) {
          console.log('URL BUTTON HIDDEN:', eid)
          return
        }

        const url = current.url

        if (!url) {
          console.warn('No URL')
          return
        }

        window.location.href = url
      }
    )
  },

  remove: () => {},
})

export {GoToURL}