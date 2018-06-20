var path = {
    basr_dir: './production',
    clean: [
        './production',
        './dara/projects/*.xlsx'
    ],
    html: {
        src: {
            main: [
                './src/index.pug',
                './src/pages/**/*.pug'
            ]
        },
        dist: {
            main: './production',
            page: './production/page/'
        },
        watch: [
            './data/**/*.json',
            './src/index.pug',
            './src/layouts/*.pug',
            './src/pages/**/*.pug',
            './src/pages/*.pug',
            './src/components/**/*.pug',
            './src/blocks/**/*.pug'
        ]
    },
    style: {
        src: './src/assets/scss/*.scss',
        dist: './production/assets/css/',
        watch: [
            './src/assets/scss/*.scss',
            './src/assets/scss/**/*.scss',
            './src/blocks/**/*.scss',
            './src/page/**/*.scss',
            './src/components/**/*.scss'
        ]
    },
    image: {
        src: './src/assets/img/**/*.*',
        dist: './production/assets/img/'
    }
};

module.exports = {path: path};