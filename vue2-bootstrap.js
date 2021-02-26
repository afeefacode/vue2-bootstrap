module.exports = {
  publicPath: '/vue/',

  sockPath: '/vue/sockjs-node',

  outputDir: 'dist',

  aliases: {
    // shared: path.resolve(__dirname, 'node_modules/@afeefa/shared-js-lib')
  },

  plugins: [],

  filenameHashing: true,

  splitChunks: true,

  extractCss: false,

  scssImports: [
    // path.resolve(__dirname, '../styles/_variables.scss'),
    // path.resolve(__dirname, '../styles/_mixins.scss')
  ],

  transpileDependencies: [
    // '@afeefa/shared-js-lib'
  ]
}
