/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                'bento': '32px',
            },
            colors: {
                'hearth-bg': '#f8fafc',
                'hearth-card': 'rgba(255, 255, 255, 0.7)',
                'pastel-cyan': '#e0faff',
                'pastel-pink': '#ffe0f0',
                'pastel-yellow': '#fffde0',
                'pastel-green': '#e0ffe0',
                'pastel-purple': '#f0e0ff',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
