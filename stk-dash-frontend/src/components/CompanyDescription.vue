<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>Company Description</span>
      </div>
    </template>
    <p>{{ stockData.description }}</p>
    <p v-if="stockData.address"><strong>Address:</strong> {{ stockData.address }}</p>
  </el-card>
</template>

<script setup>
// Props definition to receive stock data from parent
const props = defineProps({
  stockData: {
    type: Object,
    required: true,
    // Default values for company description
    default: () => ({
      // Company information
      description: 'No description available.', // Company business description
      address: '', // Company headquarters address
    }),
  },
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

p {
  margin-bottom: 1em;
  line-height: 1.5;
}
</style>
