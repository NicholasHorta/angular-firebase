export function convertSnapshots<T>(snapshots) {
  return snapshots.docs.map((snap) => {
    return {
      //| We're running this method to return an array of the data object with the id part of the object
      id: snap.id,
      ...(snap.data() as any),
    };
  });
}
