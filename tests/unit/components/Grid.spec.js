import Grid from '@/components/Grid.vue';

import { shallowMount } from '@vue/test-utils';

describe('Grid.vue', () => {
  describe('if the game is over', () => {
    it('game is not over if there are still valid clusters to select', () => {
      const mockGrid = [
        [{ color: 'transparent' }, { color: 'red' }, { color: 'orange' }],
        [{ color: 'orange' }, { color: 'blue' }, { color: 'green' }],
        [{ color: 'purple' }, { color: 'purple' }, { color: 'purple' }],
      ];

      const wrapper = shallowMount(Grid, {
        data() {
          return {
            gridMatrix: mockGrid,
            gridWidth: 3,
            gridHeight: 3,
          };
        },
      });

      wrapper.setData({ gridMatrix: mockGrid });

      const result = wrapper.vm.isGameOver();

      expect(result).toBeFalsy();
    });

    it('game IS over if there are no longer valid clusters to select', () => {
      const mockGrid = [
        [{ color: 'transparent' }, { color: 'orange' }, { color: 'blue' }],
        [{ color: 'red' }, { color: 'green' }, { color: 'red' }],
      ];

      const wrapper = shallowMount(Grid, {
        data() {
          return {
            gridMatrix: mockGrid,
            gridWidth: 3,
            gridHeight: 2,
          };
        },
      });

      wrapper.setData({ gridMatrix: mockGrid });

      const result = wrapper.vm.isGameOver();

      expect(result).toBeTruthy();
    });
  });

  describe('compactingGrid', () => {
    it('compacts vertically', () => {
      const mockGrid = [
        [{ color: 'red' }, { color: 'red' }, { color: 'orange' }],
        [{ color: 'green' }, { color: 'transparent' }, { color: 'red' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'red' }, { color: 'red' }, { color: 'orange' }],
        [{ color: 'green' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'transparent' }],
      ];

      const expectedGrid = [
        [{ color: 'red' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'red' }, { color: 'transparent' }],
        [{ color: 'red' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'red' }, { color: 'orange' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'red' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'orange' }],
      ];

      const wrapper = shallowMount(Grid, {
        data() {
          return {
            gridMatrix: mockGrid,
            gridWidth: 3,
            gridHeight: 7,
          };
        },
      });

      wrapper.setData({ gridMatrix: mockGrid });

      wrapper.vm.compactGrid();

      expect(wrapper.vm.gridMatrix).toEqual(expectedGrid);
    });

    it('compacts horizontally', () => {
      const mockGrid = [
        [{ color: 'red' }, { color: 'transparent' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'transparent' }, { color: 'red' }, { color: 'green' }],
        [{ color: 'blue' }, { color: 'transparent' }, { color: 'red' }, { color: 'orange' }],
        [{ color: 'red' }, { color: 'transparent' }, { color: 'orange' }, { color: 'blue' }],
        [{ color: 'green' }, { color: 'transparent' }, { color: 'blue' }, { color: 'orange' }],
        [{ color: 'blue' }, { color: 'transparent' }, { color: 'green' }, { color: 'orange' }],
      ];

      const expectedGrid = [
        [{ color: 'red' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'red' }, { color: 'green' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'red' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'red' }, { color: 'orange' }, { color: 'blue' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'blue' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'green' }, { color: 'orange' }, { color: 'transparent' }],
      ];

      const wrapper = shallowMount(Grid, {
        data() {
          return {
            gridMatrix: mockGrid,
            gridWidth: 4,
            gridHeight: 6,
          };
        },
      });

      wrapper.setData({ gridMatrix: mockGrid });

      wrapper.vm.compactGrid();

      expect(wrapper.vm.gridMatrix).toEqual(expectedGrid);
    });

    it('fully compacts vertical and horizontally', () => {
      const mockGrid = [
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'orange' }, { color: 'transparent' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'red' }, { color: 'green' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'orange' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'blue' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'blue' }, { color: 'orange' }, { color: 'orange' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'green' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }],
      ];

      const expectedGrid = [
        [{ color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'transparent' }, { color: 'green' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'orange' }, { color: 'orange' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'red' }, { color: 'blue' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'blue' }, { color: 'orange' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
        [{ color: 'green' }, { color: 'orange' }, { color: 'orange' }, { color: 'transparent' }, { color: 'transparent' }, { color: 'transparent' }],
      ];

      const wrapper = shallowMount(Grid, {
        data() {
          return {
            gridMatrix: mockGrid,
            gridWidth: 6,
            gridHeight: 6,
          };
        },
      });

      wrapper.setData({ gridMatrix: mockGrid });

      wrapper.vm.compactGrid();

      expect(wrapper.vm.gridMatrix).toEqual(expectedGrid);
    });
  });
});
