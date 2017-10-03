module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './index.js'
    return config
  }
}
