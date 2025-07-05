<template>
  <div class="p-4 sm:p-6 md:p-8 safe-content">
    <div
      class="mx-auto w-full max-w-3xl rounded-3xl bg-brand-bg/90 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-10 my-6 sm:my-8 md:my-10"
    >
      <!-- 关卡信息 -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <div class="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white">
            {{ currentLevel?.id || 1 }}
          </div>
          <div class="text-left">
            <div class="text-sm text-brand-text">关卡</div>
            <div class="font-bold text-brand-primary">{{ currentLevel?.name || '数数入门' }}</div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <span class="mr-1 text-xl">🔥</span>
            <span class="font-bold text-brand-accent">{{ correctStreak }}</span>
          </div>
          <div class="flex items-center">
            <span class="mr-1 text-xl">⭐</span>
            <span class="font-bold text-yellow-500">{{ currentScore }}</span>
          </div>
        </div>
      </div>
      
      <h1 class="mb-4 text-4xl font-bold text-brand-primary sm:text-5xl">
        数一数有多少个
        <span class="inline-block animate-bounce">{{ currentEmoji }}</span>
        ？
      </h1>

      <div
        class="my-8 grid min-h-[220px] grid-cols-4 gap-4 rounded-2xl bg-brand-secondary/50 p-6 sm:grid-cols-6"
        :class="{ 'items-end': currentLevel?.difficulty === 3 }"
      >
        <div
          v-for="n in itemsToCount"
          :key="n"
          class="flex items-center justify-center text-5xl"
          :class="[
            currentLevel?.difficulty === 3 ? '' : 'animate-bounce',
            currentLevel?.difficulty === 3 ? getRandomItemClass() : ''
          ]"
          :style="{ 
            animationDelay: `${n * 50}ms`,
            transform: currentLevel?.difficulty === 3 ? `scale(${0.8 + Math.random() * 0.4})` : ''
          }"
        >
          {{ currentEmoji }}
        </div>
        
        <!-- 干扰项（高难度模式） -->
        <div
          v-if="currentLevel?.difficulty === 3"
          v-for="n in distractorCount"
          :key="`distractor-${n}`"
          class="flex items-center justify-center text-5xl opacity-30"
          :style="{ transform: `scale(${0.6 + Math.random() * 0.3})` }"
        >
          {{ distractorEmoji }}
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
      
      <!-- 进度条 -->
      <div v-if="showProgressBar" class="mt-6">
        <div class="flex items-center justify-between text-sm text-brand-text">
          <span>关卡进度</span>
          <span>{{ questionsCompleted }}/{{ questionsToComplete }}</span>
        </div>
        <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            class="h-full bg-brand-primary transition-all duration-500" 
            :style="{ width: `${(questionsCompleted / questionsToComplete) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 角色引导 -->
    <CharacterGuide 
      :message="guideMessage" 
      :character="gameStore.selectedCharacter"
      :is-active="showGuide"
      :auto-speak="true"
      @close="showGuide = false"
    />
    
    <!-- 关卡完成弹窗 -->
    <div 
      v-if="showLevelComplete" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div class="mb-4 text-5xl">🎉</div>
        <h2 class="mb-2 text-2xl font-bold text-brand-primary">关卡完成！</h2>
        
        <div class="mb-6 flex justify-center">
          <div class="flex items-center">
            <span 
              v-for="i in 3" 
              :key="i"
              class="mx-1 text-4xl"
              :class="i <= earnedStars ? 'text-yellow-400' : 'text-gray-300'"
            >
              ⭐
            </span>
          </div>
        </div>
        
        <div class="mb-6 rounded-lg bg-brand-secondary/20 p-4">
          <div class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">得分:</span>
            <span class="font-bold text-brand-primary">{{ currentScore }}</span>
          </div>
          <div class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">连续答对:</span>
            <span class="font-bold text-brand-accent">{{ correctStreak }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold text-gray-700">获得数学币:</span>
            <span class="font-bold text-green-600">+{{ earnedCoins }}</span>
          </div>
        </div>
        
        <div class="flex justify-center gap-4">
          <button 
            @click="goToNextLevel"
            class="rounded-full bg-brand-primary px-6 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            下一关
          </button>
          <button 
            @click="goToLevelMap"
            class="rounded-full bg-gray-200 px-6 py-3 text-lg font-bold text-gray-700 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            关卡地图
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/game';
import { audioService } from '../services/AudioService';
import CharacterGuide from '../components/CharacterGuide.vue';

// 使用Pinia Store和路由
const gameStore = useGameStore();
const router = useRouter();

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore();
}

// 组件内部状态
const itemsToCount = ref(0);
const answerOptions = ref<number[]>([]);
const selectedAnswer = ref<number | null>(null);
const feedbackMessage = ref('');
const isCorrect = ref(false);
const currentEmoji = ref('🍎');
const distractorEmoji = ref('🍎');
const distractorCount = ref(0);
const emojiPool = ['🍎', '🍌', '⭐', '🎈', '🚗', '🎁', '🍭', '⚽️', '⭐️', '🚀'];
const correctStreak = ref(0);
const currentScore = ref(0);
const questionsCompleted = ref(0);
const questionsToComplete = ref(10);
const showGuide = ref(false);
const showLevelComplete = ref(false);
const earnedStars = ref(0);
const earnedCoins = ref(0);

// 获取当前关卡信息
const currentLevel = computed(() => {
  return gameStore.currentLevel || gameStore.gameLevels.find(l => l.type === 'counting');
});

// 是否显示进度条
const showProgressBar = computed(() => {
  return currentLevel.value && currentLevel.value.difficulty > 1;
});

// 角色引导消息
const guideMessage = computed(() => {
  if (feedbackMessage.value) {
    return feedbackMessage.value;
  }
  
  if (questionsCompleted.value === 0) {
    return '欢迎来到数数游戏！数一数屏幕上有多少个物品，然后选择正确的答案。';
  } else if (correctStreak.value >= 3) {
    return '太棒了！你已经连续答对了' + correctStreak.value + '题，继续保持！';
  } else {
    return '仔细数一数，看看有多少个' + currentEmoji.value + '呢？';
  }
});

// 根据难度设置游戏参数
const setupDifficulty = () => {
  const difficulty = currentLevel.value?.difficulty || 1;
  
  switch (difficulty) {
    case 1:
      // 初级难度：3-8个物品
      return { min: 3, max: 8, distractors: 0 };
    case 2:
      // 中级难度：5-12个物品
      return { min: 5, max: 12, distractors: 0 };
    case 3:
      // 高级难度：8-15个物品，有干扰项
      return { min: 8, max: 15, distractors: 5 };
    default:
      return { min: 3, max: 8, distractors: 0 };
  }
};

// 获取随机样式类（用于高难度模式）
const getRandomItemClass = () => {
  const classes = [
    'opacity-80',
    'opacity-90',
    'opacity-100',
    'rotate-12',
    '-rotate-12',
    'scale-110',
    'scale-90'
  ];
  return classes[Math.floor(Math.random() * classes.length)];
};

// 生成新游戏
const setupNewGame = () => {
  // 随机选择一个新的 emoji
  const emojiIndex = Math.floor(Math.random() * emojiPool.length);
  currentEmoji.value = emojiPool[emojiIndex];
  
  // 选择一个不同的干扰emoji
  let distractorIndex;
  do {
    distractorIndex = Math.floor(Math.random() * emojiPool.length);
  } while (distractorIndex === emojiIndex);
  distractorEmoji.value = emojiPool[distractorIndex];

  // 根据难度设置数字范围
  const { min, max, distractors } = setupDifficulty();
  
  // 实际数量
  const actualCount = Math.floor(Math.random() * (max - min + 1)) + min;
  itemsToCount.value = actualCount;
  
  // 设置干扰项数量
  distractorCount.value = distractors;

  // 生成答案选项
  const options = new Set<number>();
  options.add(actualCount);
  
  while (options.size < 4) {
    // 生成一个接近正确答案的随机选项
    const offset = Math.floor(Math.random() * 5) - 2; // -2到2的偏移
    const randomOption = Math.max(1, actualCount + offset);
    if (randomOption !== actualCount) {
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

  if (selectedAnswer.value === itemsToCount.value) {
    feedbackMessage.value = '太棒了，完全正确！';
    isCorrect.value = true;
    
    // 增加连续正确次数和分数
    correctStreak.value++;
    const baseScore = 10;
    const streakBonus = Math.min(correctStreak.value, 5); // 最多5倍奖励
    const questionScore = baseScore + streakBonus;
    currentScore.value += questionScore;
    
    // 增加完成题目数量
    questionsCompleted.value++;
    
    // 检查是否达到连胜徽章条件
    if (correctStreak.value >= 5) {
      gameStore.addBadge({
        id: 'math-streak',
        name: '数学连胜',
        description: '连续答对5道题',
        icon: '🔥',
        unlocked: true,
        unlockedAt: new Date()
      });
    }
    
    // 更新游戏状态
    gameStore.incrementScore(questionScore);
    gameStore.completeMathProblem();
    
    // 播放反馈音频
    audioService.speakText('太棒了，完全正确！');
    
    // 检查是否完成关卡
    if (questionsCompleted.value >= questionsToComplete.value) {
      completeLevel();
    } else {
      // 延迟1.5秒开始新游戏
      setTimeout(setupNewGame, 1500);
    }
  } else {
    feedbackMessage.value = '哎呀，再试一次吧！正确答案是 ' + itemsToCount.value;
    isCorrect.value = false;
    correctStreak.value = 0; // 重置连胜
    
    // 播放反馈音频
    audioService.speakText('哎呀，再试一次吧！');
  }
};

// 完成关卡
const completeLevel = () => {
  // 计算星级
  let stars = 1;
  if (currentScore.value >= questionsToComplete.value * 15) stars = 3;
  else if (currentScore.value >= questionsToComplete.value * 12) stars = 2;
  
  earnedStars.value = stars;
  
  // 计算奖励的数学币
  earnedCoins.value = Math.floor(currentScore.value / 10) + stars;
  
  // 更新关卡进度
  if (currentLevel.value) {
    gameStore.completeLevel(currentLevel.value.id, currentScore.value, stars);
  }
  
  // 如果得到满分，解锁徽章
  if (stars === 3) {
    gameStore.addBadge({
      id: 'perfect-score',
      name: '完美得分',
      description: '在一个关卡中获得满分',
      icon: '⭐',
      unlocked: true,
      unlockedAt: new Date()
    });
  }
  
  // 显示关卡完成弹窗
  showLevelComplete.value = true;
};

// 前往下一关
const goToNextLevel = () => {
  showLevelComplete.value = false;
  
  // 如果有下一关，前往下一关
  if (currentLevel.value) {
    const nextLevelId = currentLevel.value.id + 1;
    const nextLevel = gameStore.gameLevels.find(l => l.id === nextLevelId);
    
    if (nextLevel && nextLevel.unlocked) {
      gameStore.setCurrentLevel(nextLevelId);
      
      // 重置游戏状态
      correctStreak.value = 0;
      currentScore.value = 0;
      questionsCompleted.value = 0;
      
      // 开始新游戏
      setupNewGame();
    } else {
      // 如果没有下一关或未解锁，返回关卡地图
      router.push('/levels');
    }
  } else {
    router.push('/levels');
  }
};

// 前往关卡地图
const goToLevelMap = () => {
  showLevelComplete.value = false;
  router.push('/levels');
};

// 监听关卡变化
watch(() => gameStore.currentLevelId, () => {
  // 重置游戏状态
  correctStreak.value = 0;
  currentScore.value = 0;
  questionsCompleted.value = 0;
  
  // 开始新游戏
  setupNewGame();
});

// 组件挂载时开始第一局游戏
onMounted(() => {
  // 如果是第一次玩数数游戏，添加徽章
  if (!gameStore.badges.find(b => b.id === 'first-count')?.unlocked) {
    gameStore.addBadge({
      id: 'first-count',
      name: '初次计数',
      description: '完成第一次数数游戏',
      icon: '🔢',
      unlocked: true,
      unlockedAt: new Date()
    });
  }
  
  setupNewGame();
  
  // 显示引导
  setTimeout(() => {
    showGuide.value = true;
    
    // 5秒后隐藏引导
    setTimeout(() => {
      showGuide.value = false;
    }, 5000);
  }, 1000);
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
