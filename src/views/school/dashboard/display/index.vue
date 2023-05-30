<template>
  <div>
    <div>
      <stacked/>
    </div>
    <div class="grid-container">
      <div v-for="groupId in groupIds" :key="groupId" class="grid-item">
        <display :group-id="groupId"/>
      </div>
    </div>
  </div>
</template>

<script>
import stacked from '../components/stacked.vue'
import display from '../components/display.vue'

export default {
  components: {
    stacked,
    display
  },
  data() {
    return {
      groupIds: [1, 2, 3, 4]
    }
  }
}
</script>


<style scoped>
.grid-container {
  display: grid;
  grid-template-areas:
    "a b"
    "c d";
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
}

.grid-item:nth-child(1) {
  grid-area: a;
}

.grid-item:nth-child(2) {
  grid-area: b;
}

.grid-item:nth-child(3) {
  grid-area: c;
}

.grid-item:nth-child(4) {
  grid-area: d;
}

.grid-item {
  background-color: white; /* 设置为你想要的背景颜色 */
}
</style>
