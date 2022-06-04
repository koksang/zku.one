/** @type {import('next').NextConfig} */

const nextConfig = {
    // React's Strict Mode is a development mode only feature for highlighting potential problems in an application. 
    // It helps to identify unsafe lifecycles, legacy API usage, and a number of other features.
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // is server-side compilation or client-side compilation
        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    global: "global"
                })
            )
            
            // when normal resolving fails, how to handle/ redirect module requests
            // polyfill assert functonality
            config.resolve.fallback = {
                fs: false,
                stream: false,
                crypto: false,
                os: false,
                readline: false,
                ejs: false,
                assert: require.resolve("assert"),
                path: false
            }

            return config
        }

        return config
    }
}

module.exports = nextConfig
