module.exports = {
  portal: {
    entrance: 'app/app.js',
    output: {
      publicPath: '/'
    },
    plugins: {
      sw: {
        cacheId: 'zm-portal-cache', // 缓存名
        filename: 'tr-portal-sw.js', // service-worker 文件名
        dontCacheBustUrlsMatching: /tr-portal-sw\.js/, // 正则匹配不缓存的文件
        staticFileGlobs: ['dist/**/*.{js,css,eot,svg,ttf,woff,woff2,otf,eot}'], // 需要缓存的静态资源
        minify: true, // 是否压缩
        stripPrefix: 'dist/',
        // mergeStaticsConfig: true, // merge 你的文件名和的路径与 webpack 的 output 的路径。
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/, /\.html$/], // 批量排除掉不缓存的文件
      }
    }
  },
  parttime: {
    entrance: 'app/map-routes/app-tr.js',
    output: {
      publicPath: '/parttime/'
    },
    plugins: {
      sw: {
        cacheId: 'zm-parttime-cache',
        filename: 'tr-parttime-sw.js',
        dontCacheBustUrlsMatching: /tr-parttime-sw\.js/,
        staticFileGlobs: ['dist/**/*.{js,css,eot,svg,ttf,woff,woff2,otf,eot}'], // 需要缓存的静态资源
        minify: true,
        stripPrefix: 'dist/',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/, /\.html$/],
      }
    }
  }
};
