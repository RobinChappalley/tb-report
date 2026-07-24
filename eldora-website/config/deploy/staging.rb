server 'kzuc.ftp.infomaniak.com', user: 'kzuc_Antistc', roles: %w{app db web}

set :deploy_to, '/home/clients/4abb58ff586ce4c1a53e7d5c18efee61/sites/staging.eldora.ch'
set :branch, 'dev'

set :cachetool_reset_web_url, 'https://staging.eldora.ch'

# Protect the staging with a password
set :http_auth_users, [
   [ "eldora", "$apr1$q52p58cJ$UsPwAUz9UwMP.gSsCwGB01" ]
]
before "deploy:updated", "httpauth:protect"
