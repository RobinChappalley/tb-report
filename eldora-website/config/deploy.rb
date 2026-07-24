# config valid only for current version of Capistrano
lock '3.19.2'

set :repo_url, 'git@github.com:antistatique/eldora-website.git'

set :app_path, 'web'
set :theme_path, 'app/themes/eldora-theme'
set :theme_build, 'assets/styles/output.css'
set :php_bin_path, '/usr/bin/php-8.2'

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('.env')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push(
  'web/newsletter',
  'web/flipbook',
  'web/files',
  'web/app/uploads',
  'web/app/languages',
  'web/.well-known',
)

# Antistatique maintenance configuration.
set :maintenance_app_path, fetch(:app_path, 'web')

set :log_level, :debug

set :keep_releases, 3

set :slackistrano, false

set :ssh_options, {
  forward_agent: true
}
SSHKit.config.command_map[:php] = -> { fetch(:php_bin_path, 'php') }
SSHKit.config.command_map[:wp] = -> { fetch(:php_bin_path, 'php') + ' ' + shared_path.join('wp-cli.phar').to_s }
SSHKit.config.command_map[:composer] = -> { fetch(:php_bin_path, 'php') + ' ' + shared_path.join('composer.phar').to_s }

set :default_env, -> {
  return {
    'COMPOSER_HOME' => shared_path.join('.composer').to_s,
  };
}

namespace :deploy do
  # Copy theme assets build.
  after :updated, :deploy_build do
    on roles(:web) do
      from = File.join(fetch(:app_path), fetch(:theme_path), fetch(:theme_build))
      to = release_path.join(fetch(:app_path)).join(fetch(:theme_path)).join(fetch(:theme_build))
      info "Upload from local: \e[35m#{from}\e[0m to remote \e[35m#{to}\e[0m"
      upload! from, to, recursive: true
    end
  end

  # Set the maintenance Mode on your project when deploying.
  #after :updated, 'maintenance:on'
  after :rollback, 'maintenance:off'
end

# Cachetool
set :cachetool_roles, :app
set :cachetool_download_url, 'https://gordalina.github.io/cachetool/downloads/cachetool.phar'
set :cachetool_working_dir, -> { current_path }
SSHKit.config.command_map[:cachetool] = -> { shared_path.join('cachetool.phar') }

after 'deploy:starting', 'cachetool:install_executable'
# after 'deploy:published', :cachetool_opcache_reset do
#   on release_roles(fetch(:cachetool_roles)) do
#     within fetch(:cachetool_working_dir) do
#       execute :cachetool, "opcache:reset --web --web-path=#{current_path}/web --web-url=#{fetch(:cachetool_reset_web_url)}", raise_on_non_zero_exit: false
#     end
#   end
# end
