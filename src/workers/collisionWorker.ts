// Web Worker for broad-phase collision detection
// This runs in a separate thread to avoid blocking the main thread

interface CollisionObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'enemy' | 'collectible' | 'obstacle';
}

interface CollisionPair {
  obj1: CollisionObject;
  obj2: CollisionObject;
}

interface CollisionWorkerMessage {
  type: 'checkCollisions' | 'updateObjects';
  objects?: CollisionObject[];
  timestamp?: number;
}

interface CollisionWorkerResponse {
  type: 'collisionResults';
  collisions: CollisionPair[];
  timestamp: number;
  processingTime: number;
}

// Spatial partitioning for broad-phase collision detection
class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, CollisionObject[]>;

  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  private getCellsForObject(obj: CollisionObject): string[] {
    const cells: string[] = [];
    const startX = Math.floor(obj.x / this.cellSize);
    const startY = Math.floor(obj.y / this.cellSize);
    const endX = Math.floor((obj.x + obj.width) / this.cellSize);
    const endY = Math.floor((obj.y + obj.height) / this.cellSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        cells.push(`${x},${y}`);
      }
    }

    return cells;
  }

  update(objects: CollisionObject[]): void {
    this.grid.clear();
    
    objects.forEach((obj) => {
      const cells = this.getCellsForObject(obj);
      cells.forEach((cellKey) => {
        if (!this.grid.has(cellKey)) {
          this.grid.set(cellKey, []);
        }
        this.grid.get(cellKey)!.push(obj);
      });
    });
  }

  getPotentialCollisions(): CollisionPair[] {
    const collisions: CollisionPair[] = [];
    const processedPairs = new Set<string>();

    this.grid.forEach((objects) => {
      if (objects.length < 2) return;

      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const obj1 = objects[i];
          const obj2 = objects[j];
          
          // Create a unique key for this pair
          const pairKey = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
          
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            collisions.push({ obj1, obj2 });
          }
        }
      }
    });

    return collisions;
  }
}

// Collision detection worker
class CollisionWorker {
  private spatialGrid: SpatialGrid;
  private objects: CollisionObject[] = [];

  constructor() {
    this.spatialGrid = new SpatialGrid(100);
  }

  updateObjects(objects: CollisionObject[]): void {
    this.objects = objects;
    this.spatialGrid.update(objects);
  }

  checkCollisions(): CollisionPair[] {
    const startTime = performance.now();
    
    // Get potential collisions from spatial grid
    const potentialCollisions = this.spatialGrid.getPotentialCollisions();
    
    // Perform narrow-phase collision detection
    const actualCollisions: CollisionPair[] = [];
    
    potentialCollisions.forEach((pair) => {
      if (this.isColliding(pair.obj1, pair.obj2)) {
        actualCollisions.push(pair);
      }
    });

    const processingTime = performance.now() - startTime;
    
    return actualCollisions;
  }

  private isColliding(obj1: CollisionObject, obj2: CollisionObject): boolean {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  // Advanced collision detection methods
  private isCollidingCircle(obj1: CollisionObject, obj2: CollisionObject): boolean {
    const center1 = {
      x: obj1.x + obj1.width / 2,
      y: obj1.y + obj1.height / 2,
    };
    const center2 = {
      x: obj2.x + obj2.width / 2,
      y: obj2.y + obj2.height / 2,
    };
    
    const radius1 = Math.min(obj1.width, obj1.height) / 2;
    const radius2 = Math.min(obj2.width, obj2.height) / 2;
    
    const distance = Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
    );
    
    return distance < (radius1 + radius2);
  }

  private isCollidingSAT(obj1: CollisionObject, obj2: CollisionObject): boolean {
    // Separating Axis Theorem implementation for rotated rectangles
    // This is a simplified version - full implementation would handle rotation
    return this.isColliding(obj1, obj2);
  }

  // Performance monitoring
  getPerformanceStats(): {
    objectCount: number;
    gridCellCount: number;
    averageObjectsPerCell: number;
  } {
    const gridCellCount = this.spatialGrid['grid'].size;
    const totalObjects = Array.from(this.spatialGrid['grid'].values())
      .reduce((sum, cell) => sum + cell.length, 0);
    
    return {
      objectCount: this.objects.length,
      gridCellCount,
      averageObjectsPerCell: gridCellCount > 0 ? totalObjects / gridCellCount : 0,
    };
  }
}

// Worker instance
const collisionWorker = new CollisionWorker();

// Message handling
self.onmessage = (event: MessageEvent<CollisionWorkerMessage>) => {
  const { type, objects, timestamp } = event.data;

  switch (type) {
    case 'updateObjects':
      if (objects) {
        collisionWorker.updateObjects(objects);
      }
      break;

    case 'checkCollisions':
      const startTime = performance.now();
      const collisions = collisionWorker.checkCollisions();
      const processingTime = performance.now() - startTime;

      const response: CollisionWorkerResponse = {
        type: 'collisionResults',
        collisions,
        timestamp: timestamp || performance.now(),
        processingTime,
      };

      self.postMessage(response);
      break;

    default:
      console.warn('Unknown message type:', type);
  }
};

// Export for TypeScript
export type { CollisionObject, CollisionPair, CollisionWorkerMessage, CollisionWorkerResponse };
