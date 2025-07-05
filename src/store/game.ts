import { defineStore } from 'pinia'

// 徽章定义
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

// 关卡定义
export interface GameLevel {
  id: number
  name: string
  type: 'counting' | 'cognition' | 'addition' | 'subtraction' | 'sorting'
  difficulty: 1 | 2 | 3
  unlocked: boolean
  completed: boolean
  stars: number // 0-3星评级
  bestScore?: number
}

// 角色定义
export interface Character {
  id: string
  name: string
  type: 'wizard' | 'robot' | 'fairy'
  unlocked: boolean
  selected: boolean
}

export const useGameStore = defineStore('game', {
  state: () => ({
    // 基础游戏状态
    currentScore: 0,
    totalStars: 0,
    mathCoins: 0, // 虚拟货币
    level: 1,
    
    // 徽章系统
    badges: [] as Badge[],
    
    // 关卡系统
    gameLevels: [] as GameLevel[],
    currentLevelId: 1,
    
    // 角色系统
    characters: [] as Character[],
    selectedCharacter: 'wizard',
    
    // 学习进度
    numbersExplored: [] as number[],
    mathProblemsCompleted: 0,
    
    // 设置
    settings: {
      musicEnabled: true,
      soundEffectsEnabled: true,
      voiceEnabled: true,
      difficulty: 'normal' as 'easy' | 'normal' | 'hard',
      theme: 'default' as 'default' | 'space' | 'ocean' | 'forest'
    }
  }),

  getters: {
    badgeCount: (state) => state.badges.filter(b => b.unlocked).length,
    unlockedBadges: (state) => state.badges.filter(b => b.unlocked),
    canLevelUp: (state) => state.currentScore > state.level * 100,
    
    // 关卡相关
    availableLevels: (state) => state.gameLevels.filter(l => l.unlocked),
    currentLevel: (state) => state.gameLevels.find(l => l.id === state.currentLevelId),
    levelProgress: (state) => {
      const completed = state.gameLevels.filter(l => l.completed).length;
      return {
        completed,
        total: state.gameLevels.length,
        percentage: Math.round((completed / state.gameLevels.length) * 100)
      };
    },
    
    // 角色相关
    availableCharacters: (state) => state.characters.filter(c => c.unlocked),
    activeCharacter: (state) => state.characters.find(c => c.selected),
    
    // 学习进度
    numberExplorationProgress: (state) => {
      return {
        explored: state.numbersExplored.length,
        total: 100,
        percentage: Math.round((state.numbersExplored.length / 100) * 100)
      };
    }
  },

  actions: {
    // 基础游戏操作
    incrementScore(points: number) {
      this.currentScore += points
      // 每10分可以获得1个数学币
      this.mathCoins += Math.floor(points / 10)
      
      // 检查是否可以升级
      if (this.canLevelUp) {
        this.levelUp()
      }
    },
    
    levelUp() {
      if (this.canLevelUp) {
        this.level++
        this.addBadge({
          id: `level-${this.level}`,
          name: `等级 ${this.level} 大师`,
          description: `达到了等级 ${this.level}！`,
          icon: '🏆',
          unlocked: true,
          unlockedAt: new Date()
        })
        
        // 解锁新关卡
        this.unlockLevelsByDifficulty(Math.min(Math.ceil(this.level / 3), 3) as 1 | 2 | 3)
      }
    },
    
    // 徽章系统
    initializeBadges() {
      // 初始化所有可能的徽章
      const allBadges: Badge[] = [
        {
          id: 'first-count',
          name: '初次计数',
          description: '完成第一次数数游戏',
          icon: '🔢',
          unlocked: false
        },
        {
          id: 'number-explorer',
          name: '数字探险家',
          description: '在数字认知模块中探索了至少10个数字',
          icon: '🔍',
          unlocked: false
        },
        {
          id: 'perfect-score',
          name: '完美得分',
          description: '在一个关卡中获得满分',
          icon: '⭐',
          unlocked: false
        },
        {
          id: 'math-streak',
          name: '数学连胜',
          description: '连续答对5道题',
          icon: '🔥',
          unlocked: false
        },
        {
          id: 'number-master',
          name: '数字大师',
          description: '探索了所有100个数字',
          icon: '👑',
          unlocked: false
        }
        // 可以添加更多徽章
      ]
      
      this.badges = allBadges
    },
    
    addBadge(badge: Badge) {
      const existingBadge = this.badges.find(b => b.id === badge.id)
      if (existingBadge) {
        if (!existingBadge.unlocked) {
          existingBadge.unlocked = true
          existingBadge.unlockedAt = new Date()
          // 解锁徽章时给予奖励
          this.mathCoins += 5
          return true
        }
        return false
      } else {
        this.badges.push(badge)
        return true
      }
    },
    
    // 关卡系统
    initializeLevels() {
      // 初始化所有关卡
      const levels: GameLevel[] = [
        // 数数游戏关卡
        {
          id: 1,
          name: '数数入门',
          type: 'counting',
          difficulty: 1,
          unlocked: true,
          completed: false,
          stars: 0
        },
        {
          id: 2,
          name: '数数进阶',
          type: 'counting',
          difficulty: 2,
          unlocked: false,
          completed: false,
          stars: 0
        },
        {
          id: 3,
          name: '数数大师',
          type: 'counting',
          difficulty: 3,
          unlocked: false,
          completed: false,
          stars: 0
        },
        
        // 数字认知关卡
        {
          id: 4,
          name: '认识数字',
          type: 'cognition',
          difficulty: 1,
          unlocked: true,
          completed: false,
          stars: 0
        },
        {
          id: 5,
          name: '数字探索',
          type: 'cognition',
          difficulty: 2,
          unlocked: false,
          completed: false,
          stars: 0
        },
        
        // 加法游戏关卡
        {
          id: 6,
          name: '加法初体验',
          type: 'addition',
          difficulty: 1,
          unlocked: false,
          completed: false,
          stars: 0
        },
        
        // 减法游戏关卡
        {
          id: 7,
          name: '减法初体验',
          type: 'subtraction',
          difficulty: 1,
          unlocked: false,
          completed: false,
          stars: 0
        },
        
        // 数字排序关卡
        {
          id: 8,
          name: '数字排序',
          type: 'sorting',
          difficulty: 1,
          unlocked: false,
          completed: false,
          stars: 0
        }
      ]
      
      this.gameLevels = levels
    },
    
    unlockLevel(levelId: number) {
      const level = this.gameLevels.find(l => l.id === levelId)
      if (level && !level.unlocked) {
        level.unlocked = true
        return true
      }
      return false
    },
    
    unlockLevelsByDifficulty(difficulty: 1 | 2 | 3) {
      let unlocked = false
      this.gameLevels.forEach(level => {
        if (level.difficulty <= difficulty && !level.unlocked) {
          level.unlocked = true
          unlocked = true
        }
      })
      return unlocked
    },
    
    completeLevel(levelId: number, score: number, stars: number) {
      const level = this.gameLevels.find(l => l.id === levelId)
      if (level) {
        level.completed = true
        level.stars = Math.max(level.stars, stars)
        if (!level.bestScore || score > level.bestScore) {
          level.bestScore = score
        }
        
        // 更新总星星数
        this.totalStars = this.gameLevels.reduce((sum, l) => sum + l.stars, 0)
        
        // 解锁下一个关卡（如果存在）
        const nextLevelId = levelId + 1
        this.unlockLevel(nextLevelId)
        
        return true
      }
      return false
    },
    
    setCurrentLevel(levelId: number) {
      const level = this.gameLevels.find(l => l.id === levelId)
      if (level && level.unlocked) {
        this.currentLevelId = levelId
        return true
      }
      return false
    },
    
    // 角色系统
    initializeCharacters() {
      this.characters = [
        {
          id: 'wizard',
          name: '数学巫师',
          type: 'wizard',
          unlocked: true,
          selected: true
        },
        {
          id: 'robot',
          name: '计算机器人',
          type: 'robot',
          unlocked: false,
          selected: false
        },
        {
          id: 'fairy',
          name: '数字精灵',
          type: 'fairy',
          unlocked: false,
          selected: false
        }
      ]
    },
    
    unlockCharacter(characterId: string) {
      const character = this.characters.find(c => c.id === characterId)
      if (character && !character.unlocked) {
        character.unlocked = true
        return true
      }
      return false
    },
    
    selectCharacter(characterId: string) {
      const character = this.characters.find(c => c.id === characterId)
      if (character && character.unlocked) {
        // 取消当前选中的角色
        this.characters.forEach(c => {
          c.selected = c.id === characterId
        })
        this.selectedCharacter = characterId
        return true
      }
      return false
    },
    
    // 学习进度跟踪
    exploreNumber(num: number) {
      if (!this.numbersExplored.includes(num)) {
        this.numbersExplored.push(num)
        
        // 检查徽章解锁条件
        if (this.numbersExplored.length >= 10) {
          this.addBadge({
            id: 'number-explorer',
            name: '数字探险家',
            description: '在数字认知模块中探索了至少10个数字',
            icon: '🔍',
            unlocked: true,
            unlockedAt: new Date()
          })
        }
        
        if (this.numbersExplored.length >= 100) {
          this.addBadge({
            id: 'number-master',
            name: '数字大师',
            description: '探索了所有100个数字',
            icon: '👑',
            unlocked: true,
            unlockedAt: new Date()
          })
        }
        
        return true
      }
      return false
    },
    
    completeMathProblem() {
      this.mathProblemsCompleted++
      return this.mathProblemsCompleted
    },
    
    // 设置
    updateSettings(settings: Partial<typeof this.settings>) {
      this.settings = { ...this.settings, ...settings }
    },
    
    // 重置游戏
    resetGame() {
      this.currentScore = 0
      this.totalStars = 0
      this.mathCoins = 0
      this.level = 1
      
      // 重置徽章
      this.badges.forEach(badge => {
        badge.unlocked = false
        delete badge.unlockedAt
      })
      
      // 重置关卡
      this.gameLevels.forEach((level, index) => {
        level.completed = false
        level.stars = 0
        level.unlocked = index < 2 // 只保留前两个关卡解锁
        delete level.bestScore
      })
      
      // 重置角色
      this.characters.forEach((character, index) => {
        character.unlocked = index === 0 // 只保留第一个角色解锁
        character.selected = index === 0
      })
      this.selectedCharacter = 'wizard'
      
      // 重置学习进度
      this.numbersExplored = []
      this.mathProblemsCompleted = 0
    },
    
    // 初始化商店
    initializeStore() {
      this.initializeBadges()
      this.initializeLevels()
      this.initializeCharacters()
    }
  },
})
