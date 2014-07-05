module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');

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
        clean: ['docs']
    });

    grunt.registerTask('docs', ['clean', 'ngdocs', 'connect']);

};