module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'api',
      watch: true,
      ignore_watch: ['data', '.git/*', 'node_modules', 'src'],
      exec_mode: 'fork',
      script: './server/server.js',
      cwd: './',
      // Be careful, --inspect takes a lot of resources and is greatly reducing the dev experience when enabled.
      interpreter: 'node',
      interpreter_args: '--inspect',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ],
  deploy: {}
}
