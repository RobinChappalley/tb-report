server 'kzuc.ftp.infomaniak.com', user: 'kzuc_Antistc', roles: %w{app db web}

set :deploy_to, '/home/clients/4abb58ff586ce4c1a53e7d5c18efee61/sites/www.eldora.ch'
set :branch, 'main'

set :cachetool_reset_web_url, 'https://www.eldora.ch'
