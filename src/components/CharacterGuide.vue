<template>
  <div 
    class="character-guide"
    :class="{ 'character-guide--active': isActive }"
    @click="handleClick"
  >
    <div class="character-container">
      <div class="character-image" @click="toggleCharacter">
        <img :src="characterImage" alt="数学小精灵" />
      </div>
      <div v-if="message && showMessage" class="speech-bubble">
        <p>{{ message }}</p>
        <div class="speech-bubble-arrow"></div>
        <button class="close-button" @click.stop="closeMessage" aria-label="关闭提示">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { audioService } from '../services/AudioService'

const props = defineProps<{
  message?: string
  character?: 'wizard' | 'robot' | 'fairy'
  isActive?: boolean
  autoSpeak?: boolean
  disableVoice?: boolean // 添加一个属性来控制是否禁用语音
}>()

const emit = defineEmits(['close'])

// 控制消息气泡的显示
const showMessage = ref(true)

const characterImage = computed(() => {
  // 这里可以根据不同角色返回不同的图片路径
  // 实际使用时需要准备这些图片资源
  switch (props.character) {
    case 'robot':
      return '/characters/math-robot.svg'
    case 'fairy':
      return '/characters/math-fairy.svg'
    case 'wizard':
    default:
      return '/characters/math-wizard.svg'
  }
})

// 关闭消息气泡
const closeMessage = () => {
  showMessage.value = false
  emit('close')
}

// 点击角色头像时切换消息显示
const toggleCharacter = () => {
  showMessage.value = !showMessage.value
}

// 点击整个组件
const handleClick = () => {
  // 如果点击的是整个组件区域，也可以关闭消息
  if (showMessage.value) {
    showMessage.value = false
  } else {
    showMessage.value = true
  }
}

// 监听消息变化，自动朗读新消息
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage && props.autoSpeak && !props.disableVoice) {
      audioService.speakText(newMessage)
      // 新消息到来时，显示消息气泡
      showMessage.value = true
    } else if (newMessage) {
      // 如果禁用了语音，仍然显示消息气泡
      showMessage.value = true
    }
  }
)

// 监听isActive变化，当变为true时显示消息
watch(
  () => props.isActive,
  (newIsActive) => {
    if (newIsActive) {
      showMessage.value = true
    }
  }
)
</script>

<style scoped>
.character-guide {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  transition: all 0.3s ease;
  transform: translateY(100px);
  opacity: 0;
  cursor: pointer;
}

.character-guide--active {
  transform: translateY(0);
  opacity: 1;
}

.character-container {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.character-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-brand-accent, #FFD166);
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.character-image:hover {
  transform: scale(1.05);
}

.character-image:active {
  transform: scale(0.95);
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.speech-bubble {
  position: absolute;
  left: -240px;
  bottom: 30px; /* 进一步调整位置，使其更居中 */
  width: 220px;
  padding: 15px;
  background: #f8f9fa; /* 使用更深的背景色，增加与文字的对比 */
  border: 1px solid #e9ecef; /* 添加边框增强视觉效果 */
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: pop-in 0.3s ease-out;
  display: flex; /* 使用flex布局使文字居中 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.speech-bubble p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #212529; /* 使用更深的文字颜色，提高对比度 */
  font-weight: 600; /* 加粗，提高可读性 */
  text-align: center; /* 文字居中对齐 */
}

.speech-bubble-arrow {
  position: absolute;
  right: -10px;
  bottom: 40px; /* 调整箭头位置，使其更居中 */
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #f8f9fa; /* 匹配新的背景色 */
}

/* 添加关闭按钮 */
.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 10; /* 确保关闭按钮在最上层 */
}

.close-button:hover {
  background-color: #ff5252;
  transform: scale(1.1);
}

.close-button:active {
  transform: scale(0.9);
}

@keyframes pop-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .character-image {
    width: 80px;
    height: 80px;
  }
  
  .speech-bubble {
    left: -190px;
    width: 180px;
    padding: 12px;
    bottom: 25px;
  }
  
  .speech-bubble p {
    font-size: 14px;
  }
  
  .speech-bubble-arrow {
    bottom: 35px;
  }
}

/* 小屏幕设备的额外调整 */
@media (max-width: 480px) {
  .character-image {
    width: 70px;
    height: 70px;
  }
  
  .speech-bubble {
    left: -160px;
    width: 150px;
    padding: 10px;
  }
  
  .speech-bubble p {
    font-size: 13px;
  }
  
  .close-button {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
}
</style>
