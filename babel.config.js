module.exports = {
  presets: ['next/babel'],
  plugins: [
    process.env.NODE_ENV === 'development' && '@locator/babel-jsx/dist',
  ].filter(Boolean),
};

