module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        ngdocs: {
            options: {
                scripts: ['angular.js','logpack.js'],
                html5Mode: false
            },
            all: ['logpack.js']
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['docs'],
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        jshint: {
            src: ['logpack.js', 'test/*.js']
        }
    });

    grunt.registerTask('docs', ['clean', 'ngdocs', 'connect']);

};