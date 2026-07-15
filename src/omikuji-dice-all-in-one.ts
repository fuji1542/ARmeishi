import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'omikuji-dice-all-in-one',
  stateMachine: ({world, eid}) => {
    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, 'reality.imagefound', () => {
        console.log('マーカー検出、配置')

        // 位置・スケールを固定値にリセット
        world.setPosition(eid, 0, 0, 0.5)
        world.setScale(eid, 0.04, 0.04, 0.04)

        // 最初の角度だけランダムに設定
        const degX = Math.random() * 360
        const degY = Math.random() * 360
        const degZ = Math.random() * 360

        const targetRotation = ecs.math.quat.xDegrees(degX)
        targetRotation.setTimes(ecs.math.quat.yDegrees(degY))
        targetRotation.setTimes(ecs.math.quat.zDegrees(degZ))

        world.setQuaternion(eid, targetRotation.x, targetRotation.y, targetRotation.z, targetRotation.w)

        console.log('初期角度:', {degX, degY, degZ})

        // ここから先は物理演算に任せる（Dynamicに設定）
        ecs.Collider.set(world, eid, {
          shape: ecs.ColliderShape.Box,
          type: ecs.ColliderType.Dynamic,
          mass: 0.5,
          friction: 0.3,
          restitution: 0.2,
          lockXAxis: false,
          lockYAxis: false,
          lockZAxis: false,
          linearDamping: 0,
          angularDamping: 0,
        })

        console.log('Dynamicに設定完了、以降は物理演算で動きます')
      })
  },
})