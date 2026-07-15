import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'dice-random-rotation',
  stateMachine: ({world, eid}) => {
    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, 'reality.imagefound', () => {
        console.log('サイコロ自身が検出イベントを受信, eid:', eid)

        const randomQuat = ecs.math.quat.pitchYawRollDegrees({
          x: Math.random() * 360,
          y: Math.random() * 360,
          z: Math.random() * 360,
        })
        console.log('randomQuat:', randomQuat)

        // 自分自身(eid)の回転を変更
        world.setQuaternion(eid, randomQuat.x, randomQuat.y, randomQuat.z, randomQuat.w)
        console.log('setQuaternion実行後')

        // 直後の実際の値を確認
        const checkMatrix = ecs.math.mat4.i()
        world.getWorldTransform(eid, checkMatrix)
        console.log('設定直後の実際の回転:', checkMatrix.decomposeR())
      })
  },
})