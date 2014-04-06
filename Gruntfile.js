module.exports = function(grunt) {

    grunt.initConfig({
        shell: {
            jekyllBuild: {
                command: 'rm -rf _site/*; jekyll build --drafts',
                options: {
                    stdout: true
                }
            },
            jekyllServe: {
                command: 'jekyll serve --drafts',
                options: {
                    stdout: true
                }
            }
        },
        watch: {
            content: {
                files: [
                    '*.html',
                    '*.yml',
                    'sitemap.xml',
                    'system/_less/*.less',
                    'system/js/**.js',
                    'system/images/**',
                    'media/**',
                    '_posts/**',
                    '_includes/**',
                    '_layouts/**',
                    '_drafts/**',
                    '_data/**'
                ],
                tasks: ['less', 'shell:jekyllServe'],
                options: {
                    interrupt: true,
                    atBegin: true,
                    livereload: true
                }
            }
        },
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
                        'bower_components/bootstrap/js/affix.js'
                    ]
                }
            }
        },
        copy: {
            bootstrap: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/bootstrap/css/',
                    src: ['**'],
                    dest: 'assets/img/'
                }]
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('lessCopy', 'less:development copy:css');
    grunt.registerTask('default', ['less', 'uglify', 'copy', 'shell:jekyllBuild']);
};