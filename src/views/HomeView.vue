HTML
<template>
  <div>
    <h1 class="zoomInUp white-text">FamilyDocApp</h1>
    <p class="zoomInUp white-text" ref="textElement">
    </p>
  </div>
</template>

<script> //Make the paragraph a typeOut
export default {
  mounted() {
    this.typeOutText();
  },
  methods: {
    async typeOutText() {
      const textElement = this.$refs.textElement;
      const text = textElement.textContent; 
      textElement.textContent = '';

      for (let i = 0; i < text.length; i++) {
        textElement.textContent += text[i];
        await this.delay(50); //speed of typing
      }
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  },
};
</script>

<style>
.zoomInUp {
  animation: zoomInUp 1s ease forwards;
}

.dark-text {
  text-align: center;
  color: #333; /* Dark text color */
}

@keyframes zoomInUp {
  from {
    opacity: 0;
    transform: translateY(-150px);
  }
  to {
    opacity: 1;
    transform: translateY(-200px);
  }
}
</style>

  