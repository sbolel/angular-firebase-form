#!/usr/bin/env node
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      release: ['demo/release/vendor.js']
    },

    connect: {
      client: {
        options: {
          port: 9000,
          base: './demo',
          livereload: true,
          open: {
            target: 'http://localhost:9000',
            appName: 'Chrome',
          }
        }
      }
    },

    copy: {
      target: {
        src: 'release/<%= pkg.name %>.min.js',
        dest: 'demo/release/<%= pkg.name %>.min.js',
      },
    },

    cssmin: {
      options: {
        sourceMap: true,
        shorthandCompacting: true
      },
      target: {
        files: {
          'demo/release/vendor.min.css': [
            'bower_components/angular-material/angular-material.css'
          ]
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        globals: {
          angular: true,
          Firebase: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files: {
          'release/<%= pkg.name %>.js': [
            'src/form-module.js',
          ]
        }
      },
      vendor: {
        files: {
          'demo/release/vendor.js': [
            'bower_components/angular/angular.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-material/angular-material.js',
          ]
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'release/<%= pkg.name %>.min.js': ['release/<%= pkg.name %>.js']
        }
      },
      vendor: {
        files: {
          'demo/release/vendor.min.js': ['demo/release/vendor.js']
        }
      }
    },

    watch: {
      html: {
        files: ['public/**/*.html'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/**/*.js'],
        options: {
          livereload: true
        }
      },
      bower: {
        files: ['bower.json'],
        tasks:['wiredep']
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('build:dist', ['ngAnnotate:dist', 'uglify:dist']);
  grunt.registerTask('build:demo', ['build:dist', 'copy']);
  grunt.registerTask('build:vendor', ['ngAnnotate:vendor', 'uglify:vendor', 'clean']);
  grunt.registerTask('build', ['build:demo', 'build:vendor']);

  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('default', ['serve']);

};