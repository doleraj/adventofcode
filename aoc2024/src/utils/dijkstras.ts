interface DijkstrasCoordinate { y: number; x: number; distance: number; visited: boolean }

const updateNeighbors = (currentNode: DijkstrasCoordinate, grid: number[][], nodes: DijkstrasCoordinate[][]) => {
  [[-1, 0], [1, 0], [0, -1], [0, 1]].map(candidateModifiers => {
    const nextYIndex = currentNode.y + candidateModifiers[0];
    const nextXIndex = currentNode.x + candidateModifiers[1];
    if (nextXIndex < 0 || nextYIndex < 0 || nextXIndex === grid.length || nextYIndex === grid[0].length) {
      return;
    } else if (nodes[nextYIndex][nextXIndex].visited) {
      return;
    }

    const currentVal = grid[currentNode.y][currentNode.x];
    const nextVal = grid[nextYIndex][nextXIndex];
    if (nextVal == currentVal + 1) {
      const nextDistance = currentNode.distance + 1;
      if (nextDistance < nodes[nextYIndex][nextXIndex].distance) {
        // console.log(`Updating ${nextYIndex}, ${nextXIndex} to ${nextDistance}`)
        nodes[nextYIndex][nextXIndex].distance = nextDistance;
      }
    }
  });
}

const runDijkstras = (grid: number[][], start: number[], end: number[]): number => {
  const nodes = grid.map((line, y) =>
    line.map((cell, x) => ({ y, x, distance: Number.POSITIVE_INFINITY, visited: false } as DijkstrasCoordinate)));
  nodes[start[0]][start[1]].distance = 0;

  let sortedUnvisitedNodes = nodes.flat().filter(node => !node.visited);
  sortedUnvisitedNodes.sort((a, b) => b.distance - a.distance);
  while (sortedUnvisitedNodes.length > 0 && sortedUnvisitedNodes[sortedUnvisitedNodes.length - 1].distance != Number.POSITIVE_INFINITY) {
    const nextNode = sortedUnvisitedNodes.pop()!!;
    nextNode.visited = true;
    updateNeighbors(nextNode, grid, nodes);
    sortedUnvisitedNodes = sortedUnvisitedNodes.filter(node => !node.visited);
    sortedUnvisitedNodes.sort((a, b) => b.distance - a.distance);
  }

  const endNodes = nodes.flat().filter(node => node.y == end[0] && node.x == end[1]);
  return endNodes.map(node => node.distance).sort((a, b) => a - b)[0];
}
