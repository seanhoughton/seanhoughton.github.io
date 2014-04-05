module.exports = function(grunt) {

grunt.initConfig({
  less: {
    production: {
      options: {
        paths: ["bower_components/bootstrap/less"],
        yuicompress: true
      },
      files: {
        "system/css/application.css": "system/_less/application.less"
      }
    }
  },
  uglify: {
    jquery: {
      files: {
        'system/js/jquery.min.js': 'bower_components/jquery/dist/jquery.min.js'
      }
    },
    bootstrap: {
      files: {
        'system/js/bootstrap.min.js': ['bower_components/bootstrap/js/collapse.js',
                                       'bower_components/bootstrap/js/button.js',
                                       'bower_components/bootstrap/js/affix.js']
      }
    }
  },
  copy: {
    bootstrap: {
      files: [
        {expand: true, cwd: 'bower_components/bootstrap/css/', src: ['**'], dest: 'assets/img/'}
      ]
    }
  },
  exec: {
    build: {
      cmd: 'jekyll build'
    },
    serve: {
      cmd: 'jekyll serve --watch'
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-exec');

grunt.registerTask('default', [ 'less', 'uglify', 'copy', 'exec:build' ]);
grunt.registerTask('deploy', [ 'default', 'exec:deploy' ]);

};