module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      letterSpacing: {
        '30p': '0.3em', 
      },
      colors: {
        cosmic: {
          'nav-gray': '#F9FAFB'
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],    
        body: ['var(--font-body)', 'sans-serif'],          
      }
    },
  },
  plugins: [],
}