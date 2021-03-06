const path = require('path')
const fs = require('fs')

const pathApp = process.env.INIT_CWD
const pathAppConfig = path.join(pathApp, 'vue2-bootstrap.js')
const appConfig = require(pathAppConfig)

const vueConfig = {
  publicPath: appConfig.publicPath || undefined,

  outputDir: path.resolve(pathApp, appConfig.outputDir),

  runtimeCompiler: true,

  productionSourceMap: process.env.NODE_ENV !== 'production',

  filenameHashing: appConfig.filenameHashing === true || false,

  transpileDependencies: [
    ...appConfig.transpileDependencies
  ],

  devServer: {
    public: '0.0.0.0',
    disableHostCheck: true,
    sockPath: appConfig.sockPath || undefined,
    watchOptions: {
      poll: process.platform !== 'linux'
    }
  },

  configureWebpack: {
    devtool: appConfig.devtool,

    plugins: [
      ...appConfig.plugins
    ],

    resolve: {
      // do not resolve to orig of linked sources
      // e.g. linked @afeefa/shared-js-lib
      symlinks: false,
      alias: {
        // prevent multiple instances of vue
        // https://github.com/webpack/webpack/issues/2134#issuecomment-192579511
        // and https://github.com/vuetifyjs/vuetify/issues/4068
        vue: path.resolve(pathApp, 'node_modules', 'vue'),
        '@': path.resolve(pathApp, 'src'),
        ...appConfig.aliases
      },
      extensions: ['.js', '.vue', '.json']
    }
  },

  chainWebpack: config => {
    const pathIndex = path.resolve(pathApp, 'public', 'index.html')
    if (fs.existsSync(pathIndex)) {
      // use projects public/index.html
      const htmlPlugin = config.plugins.get('html')
      if (htmlPlugin) {
        config
          .plugin('html')
          .tap(args => {
            args[0].template = path.resolve(pathApp, 'public', 'index.html')
            return args
          })
      }
    }

    if (!appConfig.splitChunks) {
      config.optimization.delete('splitChunks')
    }
  },

  css: {
    extract: appConfig.extractCss || false,

    loaderOptions: {
      scss: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        additionalData: appConfig.scssImports
          ? appConfig.scssImports.map(i => `@import "${i}";`).join(' ')
          : undefined
      }
    }
  }
}

// console.log(JSON.stringify(vueConfig, null, 4))

module.exports = vueConfig
