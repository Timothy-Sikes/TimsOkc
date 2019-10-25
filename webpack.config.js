const path = require('path');
var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = env => {
    console.log(env.TIMS_API_URL);

    return {
        entry: {
            cookingCard: './src/components/cookingCard.js',
            currentlyReading: './src/components/currentlyReading.js',
            recentReviews: './src/components/recentReviews.js'
        },
        module: {
            rules: [
            // ... other rules
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
            TIMS_API_URL: JSON.stringify(env.TIMS_API_URL)
            })
        ],
        resolve: {
            extensions: [ '.js', '.vue' ],
            alias: {
              'vue$': 'vue/dist/vue.runtime.min.js',
              '@': path.resolve(__dirname, './content/static/scripts/js/dist/'),
              'static': path.resolve(__dirname, "./content/static/scripts/js/")
            }
          },
        output: {
            path: path.resolve(__dirname, './content/static/scripts/js/dist/'),
            filename: '[name].js'
    }
    }
};