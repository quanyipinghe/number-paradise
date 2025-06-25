import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentScore: 0,
    badges: [] as string[],
    level: 1,
  }),

  getters: {
    badgeCount: (state) => state.badges.length,
    canLevelUp: (state) => state.currentScore > state.level * 100,
  },

  actions: {
    incrementScore(points: number) {
      this.currentScore += points
    },
    addBadge(badgeName: string) {
      if (!this.badges.includes(badgeName)) {
        this.badges.push(badgeName)
      }
    },
    levelUp() {
      if (this.canLevelUp) {
        this.level++
        this.addBadge(`等级 ${this.level} 大师`)
      }
    },
    resetGame() {
      this.currentScore = 0
      this.badges = []
      this.level = 1
    },
  },
})
