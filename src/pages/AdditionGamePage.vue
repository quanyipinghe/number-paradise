<template>
  <div class="p-4 sm:p-6 md:p-8 safe-content">
    <div
      class="mx-auto w-full max-w-3xl rounded-3xl bg-brand-bg/90 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-10 my-6 sm:my-8 md:my-10"
    >
      <h1 class="mb-4 text-4xl font-bold text-brand-primary sm:text-5xl">
        {{ firstNumber }} + {{ secondNumber }} = ?
      </h1>

      <div
        class="my-8 grid min-h-[220px] grid-cols-2 gap-8 rounded-2xl bg-brand-secondary/50 p-6"
      >
        <!-- 第一个数字的物品 -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <div
            v-for="n in firstNumber"
            :key="`first-${n}`"
            class="flex animate-bounce items-center justify-center text-5xl"
            :style="{ animationDelay: `${n * 50}ms` }"
          >
            {{ firstEmoji }}
          </div>
        </div>
        
        <!-- 第二个数字的物品 -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <div
            v-for="n in secondNumber"
            :key="`second-${n}`"
            class="flex animate-bounce items-center justify-center text-5xl"
            :style="{ animationDelay: `${n * 50 + 200}ms` }"
          >
            {{ secondEmoji }}
          </div>
        </div>
      </div>

      <div class="mb-8 flex flex-wrap justify-center gap-4">
        <button
          v-for="option in answerOptions"
          :key="option"
          @click="selectAnswer(option)"
          class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-secondary bg-white text-3xl font-bold text-brand-bg shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          :class="{
            '!scale-110 !border-brand-accent !bg-brand-accent/30 ring-4 ring-brand-accent':
              selectedAnswer === option,
          }"
        >
          {{ option }}
        </button>
      </div>

      <div class="text-center">
        <button
          @click="checkAnswer"
          class="transform rounded-full bg-brand-primary px-10 py-4 text-2xl font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
          :disabled="selectedAnswer === null"
        >
          确认答案
        </button>
        <p
          v-if="feedbackMessage"
          class="mt-6 text-3xl font-bold"
          :class="isCorrect ? 'text-green-500' : 'text-red-500'"
        >
          {{ feedbackMessage }}
        </p>
      </div>
    </div>
    
    <!-- 角色引导 -->
    <CharacterGuide 
      :message="guideMessage" 
      :character="gameStore.selectedCharacter"
      :is-active="showGuide"
      :auto-speak="autoSpeak"
      @close="showGuide = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGameStore } from '../store/game';
import CharacterGuide from '../components/CharacterGuide.vue';

// 使用Pinia Store
const gameStore = useGameStore();

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore();
}

// 组件内部状态
const firstNumber = ref(0);
const secondNumber = ref(0);
const answerOptions = ref<number[]>([]);
const selectedAnswer = ref<number | null>(null);
const feedbackMessage = ref('');
const isCorrect = ref(false);
const firstEmoji = ref('🍎');
const secondEmoji = ref('🍌');
const emojiPool = ['🍎', '🍌', '⭐', '🎈', '🚗', '🎁', '🍭', '⚽️', '⭐️', '🚀'];
const correctAnswersStreak = ref(0);
const showGuide = ref(false);
const autoSpeak = ref(false);

// 获取当前关卡信息
const currentLevel = computed(() => {
  return gameStore.currentLevel || gameStore.gameLevels.find(l => l.type === 'addition');
});

// 根据关卡难度设置题目难度
const setupDifficulty = () => {
  const difficulty = currentLevel.value?.difficulty || 1;
  
  switch (difficulty) {
    case 1:
      // 初级难度：1-5的加法
      return { min: 1, max: 5 };
    case 2:
      // 中级难度：1-10的加法
      return { min: 1, max: 10 };
    case 3:
      // 高级难度：5-15的加法
      return { min: 5, max: 15 };
    default:
      return { min: 1, max: 5 };
  }
};

// 角色引导消息
const guideMessage = computed(() => {
  if (feedbackMessage.value) {
    return feedbackMessage.value;
  }
  
  if (correctAnswersStreak.value === 0) {
    return '欢迎来到加法游戏！数一数两边的物品总共有多少个，然后选择正确的答案。';
  } else if (correctAnswersStreak.value < 3) {
    return '做得很好！继续加油！';
  } else if (correctAnswersStreak.value < 5) {
    return '太棒了！你真是个加法小能手！';
  } else {
    return '哇！你已经连续答对了' + correctAnswersStreak.value + '题，真是太厉害了！';
  }
});

// 监听反馈消息变化，显示角色引导
watch(feedbackMessage, (newValue) => {
  if (newValue) {
    showGuide.value = true;
    autoSpeak.value = true;
    
    // 3秒后隐藏引导
    setTimeout(() => {
      showGuide.value = false;
    }, 3000);
  }
});

// 生成新游戏
const setupNewGame = () => {
  // 随机选择两个不同的emoji
  const emojiIndices: number[] = [];
  while (emojiIndices.length < 2) {
    const index = Math.floor(Math.random() * emojiPool.length);
    if (!emojiIndices.includes(index)) {
      emojiIndices.push(index);
    }
  }
  firstEmoji.value = emojiPool[emojiIndices[0]];
  secondEmoji.value = emojiPool[emojiIndices[1]];

  // 根据难度设置数字范围
  const { min, max } = setupDifficulty();
  
  // 生成两个随机数
  firstNumber.value = Math.floor(Math.random() * (max - min + 1)) + min;
  secondNumber.value = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // 计算正确答案
  const correctAnswer = firstNumber.value + secondNumber.value;

  // 生成答案选项
  const options = new Set<number>();
  options.add(correctAnswer);
  
  while (options.size < 4) {
    // 生成一个接近正确答案的随机选项
    const offset = Math.floor(Math.random() * 5) - 2; // -2到2的偏移
    const randomOption = Math.max(1, correctAnswer + offset);
    if (randomOption !== correctAnswer) {
      options.add(randomOption);
    }
  }
  
  answerOptions.value = Array.from(options).sort((a, b) => a - b);

  // 重置状态
  selectedAnswer.value = null;
  feedbackMessage.value = '';
  isCorrect.value = false;
  
  // 显示引导消息
  setTimeout(() => {
    showGuide.value = true;
    autoSpeak.value = true;
    
    // 5秒后隐藏引导
    setTimeout(() => {
      showGuide.value = false;
    }, 5000);
  }, 500);
};

// 选择答案
const selectAnswer = (option: number) => {
  selectedAnswer.value = option;
};

// 检查答案
const checkAnswer = () => {
  if (selectedAnswer.value === null) return;

  const correctAnswer = firstNumber.value + secondNumber.value;
  
  if (selectedAnswer.value === correctAnswer) {
    feedbackMessage.value = '太棒了，完全正确！';
    isCorrect.value = true;
    
    // 增加连续正确次数
    correctAnswersStreak.value++;
    
    // 检查是否达到连胜徽章条件
    if (correctAnswersStreak.value >= 5) {
      gameStore.addBadge({
        id: 'math-streak',
        name: '数学连胜',
        description: '连续答对5道题',
        icon: '🔥',
        unlocked: true,
        unlockedAt: new Date()
      });
    }
    
    // 根据连续正确次数给予不同分数
    const baseScore = 10;
    const streakBonus = Math.min(correctAnswersStreak.value, 5); // 最多5倍奖励
    const totalScore = baseScore + streakBonus;
    
    gameStore.incrementScore(totalScore);
    gameStore.completeMathProblem();
    
    // 如果是关卡模式，更新关卡进度
    if (currentLevel.value) {
      // 根据连续正确次数计算星级
      let stars = 1;
      if (correctAnswersStreak.value >= 10) stars = 3;
      else if (correctAnswersStreak.value >= 5) stars = 2;
      
      gameStore.completeLevel(currentLevel.value.id, totalScore, stars);
    }
    
    // 延迟1.5秒开始新游戏
    setTimeout(setupNewGame, 2000);
  } else {
    feedbackMessage.value = '哎呀，再试一次吧！正确答案是 ' + correctAnswer;
    isCorrect.value = false;
    correctAnswersStreak.value = 0; // 重置连胜
  }
};

// 组件挂载时开始第一局游戏
onMounted(() => {
  setupNewGame();
  
  // 如果是第一次玩加法游戏，显示引导
  if (!gameStore.badges.find(b => b.id === 'first-addition')?.unlocked) {
    showGuide.value = true;
    autoSpeak.value = true;
    
    // 添加"第一次加法"徽章
    gameStore.addBadge({
      id: 'first-addition',
      name: '加法初体验',
      description: '完成第一次加法游戏',
      icon: '➕',
      unlocked: true,
      unlockedAt: new Date()
    });
  }
});
</script>

<style scoped>
/* 针对移动设备的安全区域内边距 */
.safe-content {
  padding-top: max(1.5rem, env(safe-area-inset-top, 0px) + 5rem);
  padding-bottom: max(5rem, env(safe-area-inset-bottom, 0px) + 5rem);
  min-height: 100vh;
}

/* 针对iOS Safari的特殊处理 */
@supports (-webkit-touch-callout: none) {
  .safe-content {
    padding-top: calc(env(safe-area-inset-top, 0px) + 5rem);
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem);
  }
  
  .fixed.inset-0 {
    top: env(safe-area-inset-top, 0px);
    bottom: env(safe-area-inset-bottom, 0px);
  }
}
</style>
