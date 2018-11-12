export function addCollisions (scene, origin, collisionObjects) {
    if (collisionObjects) {
        collisionObjects.target
            ? scene.physics.add.collider(collisionObjects.target, origin, collisionObjects.callback)
            : collisionObjects.forEach(collisionObject => {
                scene.physics.add.collider(collisionObject.target, origin, collisionObject.callback);
            });
    }
}
