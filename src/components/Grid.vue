<template>
  <div>
    <div
      v-for="(row, rowIndex) in gridMatrix"
      :key="`row${rowIndex}`"
      class="mb-1">
      <div
        v-for="(col, colIndex) in row"
        :key="`col${colIndex}${rowIndex}`"
        class="d-inline-block mx-1"
        @click="handleClick(rowIndex, colIndex)">
        <grid-item
          :is-highlighted="col.isHighlighted"
          :color="col.color" />
      </div>
    </div>
  </div>
</template>

<script>
import GridItem from '@/components/GridItem.vue';

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
      gridWidth: 10,
      gridHeight: 10,
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
      } else {
        this.clearSelection();
        this.compactGrid();
        // clear squashed items
        // rebuild matrix
        // test is complete
      }
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

      this.$nextTick(() => {
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
      });
    },

    randomColor() {
      const palleteLength = colorPalette.length;
      const randomIndex = Math.floor(Math.random() * palleteLength);
      return colorPalette[randomIndex];
    },
  },
};
</script>

<style lang="text/scss">

</style>
