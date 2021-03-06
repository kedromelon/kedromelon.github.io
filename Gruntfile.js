module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        files: [{
          dot: true,
          src: ['build/{,*!images/}*', '!build/images']
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '{,*/}*.js',
          dest: 'build'
        }]
      }
    },
    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: 'build'
        }]
      }
    },
    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['{,*/}*.css', '!{,*/}*.min.css'],
          dest: 'build'
        }]
      }
    },
    concurrent: {
      build: [
        'imagemin',
      ],
      options: {
        limit: 5,
        logConcurrentOutput: true
      }
    },
    htmlcompressor: {
      compile: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '{,*/}*.html',
          dest: 'build'
        }],
        options: {
          type: 'html',
          preserveServerScript: true,
          compressJs: true
        }
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'build',
          src: [
            'CNAME',
            '*.{ico,txt}',
            'icons/*',
            '.htaccess',
            '{,*/}*.{webp}',
            '{,*/}*.unity3d',
            '{,*/}*.min.css'
          ]
        }]
      }
    },
    git_deploy: {
      dist: {
        options: {
          url: 'git@github.com:kedromelon/kedromelon.github.io.git',
          branch: 'master'
        },
        src: 'build'
      },
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-htmlcompressor');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-git-deploy');

  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'uglify', 
    'cssmin',
    'htmlcompressor',
    'newer:imagemin',
    'copy'
  ]);

  grunt.registerTask('deploy', [
    'default',
    'git_deploy'
  ]);

};