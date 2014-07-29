module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        stylus: {
          compile: {
            options: {
              use: [ require('nib')() ]
            },
            files: {
              'src/css/main.css': 'src/css/stylus/main.styl',
              'src/css/responsive.css': 'src/css/stylus/responsive.styl'
            }
          }
        },

        // Assembles your email content with html layout
        assemble: {
          options: {
            layoutdir: 'src/layouts',
            flatten: true
          },
          pages: {
            src: ['src/emails/*.ejs'],
            dest: 'dist/'
          }
        },

        // Inlines your css
        premailer: {
          simple: {
            options: {
              removeComments: true
            },
            files: [{
                expand: true,
                src: ['dist/*.html'],
                dest: ''
            }]
          }
        },

        // Watches for changes to css or email templates then runs grunt tasks
        watch: {
          files: ['src/css/stylus/*','src/emails/*','src/layouts/*'],
          tasks: ['default']
        },

        // Use Mailgun option if you want to email the design to your inbox or to something like Litmus
        mailgun: {
          mailer: {
            options: {
              key: 'key-86qesagtghtkxfaq-ps7vndp1d5j5qk1',
              sender: 'noreply@3advance.com',
              recipient: 'peter@3advance.com',
              subject: 'This is a test email'
            },
            src: ['dist/'+grunt.option('template')]
          }
        },

        cdn: {
          options: {
            cdn: 'http://www.scorefolio.com/',
            flatten: true,
            supportedTypes: 'html'
          },
          dist: {
            src: ['./dist/*.html']
          }
        },

        nodestatic: {
          server: {
            options: {
              port: 8000,
              base: 'dist'
            }
          }
        }

    });

    // Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-mailgun');
    grunt.loadNpmTasks('grunt-premailer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cdn');
    grunt.loadNpmTasks('grunt-nodestatic');

    grunt.registerTask('default', ['stylus','assemble','premailer']);

    grunt.registerTask('send', ['mailgun']);

    grunt.registerTask('compile', ['default', 'cdn']);

    grunt.registerTask('server', ['nodestatic', 'watch'])

};
