module.exports = {
  apps : [
      {
        name: 'Secure-Login',
        cwd: '/home/hGen/servers/secure-login/build',
        interpreter: '/usr/bin/node',
        script: '/home/hGen/servers/secure-login/build/server.js',

        append_env_to_name: true,
        autorestart: false,
        exec_mode: "fork",
        instance_var: "INSTANCE_ID",
        watch: true,

        env: {
          NODE_ENV: 'live'
        }, 
        env_production: { 
        NODE_ENV: 'production' 
        }
      }
  ]
}

