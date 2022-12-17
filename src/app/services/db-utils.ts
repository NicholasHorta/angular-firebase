export function convertSnapshots<T>(snapshots) {
  return snapshots.docs.map((snap) => {
    return {
      id: snap.id,
      ...(snap.data() as any),
    };
  });
}
