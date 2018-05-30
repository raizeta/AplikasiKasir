module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
            'www/build/minify/app.min.js': 
              [
                'www/build/annotate/*.js',
                'www/build/annotate/services/*.js',
                'www/build/annotate/controllers/*.js',
                'www/build/annotate/directives/*.js',
                'www/build/annotate/filter/*.js',
                'www/build/annotate/routing/*.js',
                'www/build/annotate/factory/*.js',
                'www/build/annotate/factory/comb/*.js',
                'www/build/annotate/factory/server/*.js',
                'www/build/annotate/factory/sqlite/*.js'
              ]
        }
      }
    }
    
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default','uglify');
};