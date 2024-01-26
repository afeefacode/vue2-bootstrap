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
    allowedHosts: 'all',

    webSocketServer: {
      type: 'sockjs',
      options: {
        path: appConfig.sockPath || undefined
      }
    },

    client: {
      webSocketTransport: 'sockjs',
      webSocketURL: {
        hostname: '0.0.0.0',
        port: 443,
        pathname: appConfig.sockPath || undefined
      }
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

    // https://github.com/webpack/webpack-dev-server/issues/3453#issuecomment-863630905
    // webpack caches all node_module folder otherwise
    config.merge({
      snapshot: {
        managedPaths: []
      }
    })
  },

  css: {
    extract: appConfig.extractCss || false,

    loaderOptions: {
      css: {
        // https://webpack.js.org/loaders/css-loader/#url
        // allows absolute paths in url() functions
        url: {
          filter: url => {
            return !url.startsWith('/')
          }
        }
      },

      // ignore deprecation warnings which e.g. is vuetify full of
      // sassLoaderOptions: {
      //   warnRuleAsWarning: false
      // },
      sass: {
        ...appConfig.sassLoaderOptions
      },

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
