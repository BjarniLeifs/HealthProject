  module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        options: {
          separator: '\n'
        },
        basic: {
          src: ['src/**/*.js'],
          dest: 'out/JBerry.js',
        }
      },
      less: {
        development: {
          options: {
            paths: ['css/less'],
            yuicompress: true,
            optimization: 2
          },
          files: {
            // target.css file: source.less file
            'out/TheMaster.css': 'css/less/TheMaster.less'
          }
        }
      },
      uglify: {
        options: {
          banner: '/*! Made on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        basic: {
          files: {
            'out/JBerry.min.js': ['<%= concat.basic.dest %>']
          }
        }
      },
      jshint: {
        files: ['server.js', 'Gruntfile.js', 'src/**/*.js', 'server/**/*.js', 'models/*.js', 'routes/*.js', 'config/*.js'],
        options: {
          // options here to override JSHint defaults
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      watch: {
        js: {
          files: ['src/**/*.js'],
          tasks: ['concat:basic'],
          options: {
            livereload: true,
          }
        },
        css: {
          files: ['css/less/*.less'],
          tasks: ['less'],
          options: {
            nospawn: true
          }
        }
      },
      express: {
        server: {
          options: {
            script: './server.js'
          }
        }
      }
    });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'express:server', 'watch', 'less']);
};