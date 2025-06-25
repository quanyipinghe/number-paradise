/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#1A202C', // 深灰蓝背景
        'brand-primary': '#38B2AC', // 霓虹青色
        'brand-secondary': '#ED8936', // 霓虹橙色
        'brand-accent': '#F6E05E', // 霓虹黄色
        'brand-text': '#E2E8F0', // 浅灰色文字
      },
      fontFamily: {
        'display': ['"Luckiest Guy"', 'cursive'], // 更卡通的显示字体
        'sans': ['"Comic Neue"', 'cursive'], // 保留一个可读性好的字体
      },
    },
  },
  plugins: [],
}

