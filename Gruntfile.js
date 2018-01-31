module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            example: {
                port: 1337,
                base: '../bandsintown'
            }
        },
        less: {
            options: {
                paths: ['../bandsintown']
            },
            files: {
                "css/styles.css": "less/styles.less"
            }
        }
        // ,
        // watch: {
        //   files:['../bandsintown/**'],
        //   tasks:'',
        //   options: {
        //     livereload: true
        //   }
        // }
    });

    grunt.loadNpmTasks('grunt-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['connect:example', 'less']);
};