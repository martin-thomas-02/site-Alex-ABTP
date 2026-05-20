/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.html"],
  theme: {
    extend: {
      colors: {
        abtp: {
          yellow:     '#FFC72C',
          yellowSoft: '#FFE066',
          blue:       '#3B82C4',
          charcoal:   '#1A1A1A',
          steel:      '#4A4A4A',
          light:      '#F5F5F5',
          whatsapp:   '#25D366',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Arial Narrow', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
