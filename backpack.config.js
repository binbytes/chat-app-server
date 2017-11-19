module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './src/index.js'
    return config
  }
}
