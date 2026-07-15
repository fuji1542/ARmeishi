import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'door-play-on-marker-found',
  schema: {
    door: ecs.eid,
    nextModel: ecs.eid,
  },
  data: {
    nextModelStarted: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, 'reality.imagefound', () => {
        console.log('マーカー検出、ドアアニメーション再生')

        const {door, nextModel} = schemaAttribute.get(eid)
        if (!door || !nextModel) {
          console.log('エラー: door または nextModel が未設定です')
          return
        }

        // フラグをリセット
        dataAttribute.cursor(eid).nextModelStarted = false

        ecs.GltfModel.set(world, door, {
          paused: false,
          time: 0,
        })
      })
      .listen(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (event) => {
        const data = dataAttribute.cursor(eid)

        // 既に次のモデルを再生済みなら何もしない（無限ループ防止）
        if (data.nextModelStarted) {
          return
        }

        console.log('アニメーション終了イベント受信:', event.data.name)

        const {door, nextModel} = schemaAttribute.get(eid)
        if (!nextModel) return

        // ドアのアニメーションが終わった時だけ反応する（Poster自身の終了は無視）
        if (event.target !== door) {
          return
        }

        data.nextModelStarted = true  // フラグを立てて、以降は無視する

        ecs.GltfModel.set(world, nextModel, {
          paused: false,
          time: 0,
        })

        console.log('次のモデルのアニメーション再生開始')
      })
  },
})