<template>
  <div>
    {{ scorer.totalScore }}
    {{ potentialScore }}
    {{ screenWidth }} x {{ screenHeight }}
    <div
      v-for="(row, rowIndex) in gridMatrix"
      :key="`row${rowIndex}`"
      class="mb-1 text-center m-auto">
      <div
        v-for="(col, colIndex) in row"
        :key="`col${colIndex}${rowIndex}`"
        class="d-inline-block"
        @click="handleClick(rowIndex, colIndex)">
        <grid-item
          class="grid-item"
          :is-highlighted="col.isHighlighted"
          :color="col.color" />
      </div>
    </div>
  </div>
</template>

<script>
import GridItem from '@/components/GridItem.vue';
import Scorer from '@/Scorer';

const colorPalette = [
  'red',
  'green',
  'blue',
  'orange',
];

export default {
  components: {
    GridItem,
  },
  data() {
    return {
      gridMatrix: [],
      scorer: new Scorer(),
      potentialScore: 0,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      itemWidth: 85,
      itemHeight: 85,
      gridWidth: 11,
      gridHeight: 8,
    };
  },
  created() {
    const matrix = [];
    for (let row = 0; row < this.gridHeight; row += 1) {
      matrix[row] = [];
      for (let col = 0; col < this.gridWidth; col += 1) {
        matrix[row].push({
          color: this.randomColor(),
          isHighlighted: false,
        });
      }
    }
    this.gridMatrix = matrix;
  },
  methods: {
    handleClick(row, col) {
      const item = this.gridMatrix[row][col];
      if (!item.isHighlighted) {
        this.resetHighlighted();
        this.handleHighlighting(item, row, col);
        this.potentialScore = this.scorer.calculatePotentialScore(this.getSelectedCluster().length);
      } else {
        this.scorer.updateScore(this.potentialScore);
        this.potentialScore = 0;
        this.clearSelection();
        window.navigator.vibrate(250);
        this.compactGrid();
        if (this.isGameOver()) {
          alert('game over');
        }
      }
    },

    isGameOver() {
      let validClustersExist = false;
      for (let col = 0; col < this.gridWidth; col += 1) {
        for (let row = 0; row < this.gridHeight; row += 1) {
          const item = this.gridMatrix[row][col];
          if (item.color !== 'transparent') {
            const north = row > 0 ? this.gridMatrix[row - 1][col] : undefined;
            const east = col < this.gridWidth - 1 ? this.gridMatrix[row][col + 1] : undefined;
            const west = col > 0 ? this.gridMatrix[row][col - 1] : undefined;
            const south = row < this.gridHeight - 1 ? this.gridMatrix[row + 1][col] : undefined;

            validClustersExist = this.isSameColor(item, north)
                                 || this.isSameColor(item, south)
                                 || this.isSameColor(item, east)
                                 || this.isSameColor(item, west);
            if (validClustersExist) {
              break;
            }
          }
        }
        if (validClustersExist) {
          break;
        }
      }
      return !validClustersExist;
    },

    isSameColor(a, b) {
      return b && b.color === a.color;
    },

    compactGrid() {
      for (let col = this.gridWidth - 1; col >= 0; col -= 1) {
        for (let row = this.gridHeight - 1; row > 0; row -= 1) {
          const item = this.gridMatrix[row][col];
          if (item.color === 'transparent') {
            for (let i = row - 1; i >= 0; i -= 1) {
              const above = this.gridMatrix[i][col];
              if (above.color !== 'transparent') {
                item.color = above.color;
                above.color = 'transparent';
                break;
              }
            }
          }
        }
      }

      for (let col = 0; col < this.gridWidth; col += 1) {
        if (this.isEmptyColumn(col)) {
          for (let rightCol = col + 1; rightCol < this.gridWidth; rightCol += 1) {
            if (!this.isEmptyColumn(rightCol)) {
              for (let row = 0; row < this.gridHeight; row += 1) {
                this.gridMatrix[row][col].color = this.gridMatrix[row][rightCol].color;
                this.gridMatrix[row][rightCol].color = 'transparent';
              }
              break;
            }
          }
        }
      }
    },

    isEmptyColumn(colIndex) {
      return this.gridMatrix.every((row) => row[colIndex].color === 'transparent');
    },

    clearSelection() {
      const cluster = this.getSelectedCluster();
      cluster.forEach((selection) => {
        const localSelection = selection;
        localSelection.color = 'transparent';
        localSelection.isHighlighted = false;
      });
    },

    getSelectedCluster() {
      return this.gridMatrix.flat().filter((col) => col.isHighlighted);
    },

    resetHighlighted() {
      this.gridMatrix.forEach((row) => {
        row.forEach((column) => {
          const localColumn = column;
          localColumn.isHighlighted = false;
        });
      });
    },

    handleHighlighting(item, row, col) {
      const localItem = item;
      let hasNorth = false;
      let hasSouth = false;
      let hasEast = false;
      let hasWest = false;

      if (localItem.color !== 'transparent') {
        if (row > 0) {
          const northItem = this.gridMatrix[row - 1][col];
          if (!northItem.isHighlighted && northItem.color === localItem.color) {
            hasNorth = true;
            localItem.isHighlighted = true;
            northItem.isHighlighted = true;
          }
        }

        if (row < this.gridMatrix.length - 1) {
          const southItem = this.gridMatrix[row + 1][col];
          if (!southItem.isHighlighted && southItem.color === localItem.color) {
            hasSouth = true;
            localItem.isHighlighted = true;
            southItem.isHighlighted = true;
          }
        }

        if (col > 0) {
          const westItem = this.gridMatrix[row][col - 1];
          if (!westItem.isHighlighted && westItem.color === localItem.color) {
            hasWest = true;
            localItem.isHighlighted = true;
            westItem.isHighlighted = true;
          }
        }

        if (col < this.gridMatrix[row].length - 1) {
          const eastItem = this.gridMatrix[row][col + 1];
          if (!eastItem.isHighlighted && eastItem.color === localItem.color) {
            hasEast = true;
            localItem.isHighlighted = true;
            eastItem.isHighlighted = true;
          }
        }

        if (hasWest) {
          this.handleHighlighting(item, row, col - 1);
        }

        if (hasEast) {
          this.handleHighlighting(item, row, col + 1);
        }

        if (hasSouth) {
          this.handleHighlighting(item, row + 1, col);
        }

        if (hasNorth) {
          this.handleHighlighting(item, row - 1, col);
        }
      }
    },

    randomColor() {
      const palleteLength = colorPalette.length;
      const randomIndex = Math.floor(Math.random() * palleteLength);
      return colorPalette[randomIndex];
    },
  },
};
</script>

<style>
.grid-item {
  width: 75px;
  height: 75px;
}

@media (max-width: 1000px) {
  @media(orientation: landscape) {
    .grid-item {
      width: 20px;
      height: 20px;
    }
  }

  .grid {
    min-width: 350px;
  }

  @media(orientation: portrait) {
    .grid-item {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
