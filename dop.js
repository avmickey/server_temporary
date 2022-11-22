// ! npm install -g pm2   pm2 init   nano ecosystem.config.js   pm2 start ecosystem.config.js   pm2 startup   pm2 save

module.exports = {
  apps: [
    {
      name: 'nuxt-dev',
      script: 'npm',
      args: 'run dev',
    },
    {
      name: 'nuxt-prod',
      script: 'npm',
      args: 'run start',
    },
  ],
};

// ! postgres
// sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
// wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -     репозитория
//
// apt-get update      Осталось обновить список пакетов в системе, это делаем стандартной командой.
// apt-cache search postgresql-13     проверки того, что теперь нам доступны пакеты PostgreSQL
//
// apt-get -y install postgresql     Установка необходимых пакетов для PostgreSQL
// systemctl status postgresql    Проверка установки
//
// su - postgres   Давайте переключимся на пользователя postgres
// psql      это консоль для PostgreSQL
// \du     базы данныйх
// \q     выход
// \password postgres
//  create user info_comp with password '123456';      новый пользователь
// create database test_db;     новая база данных
// drop database db_user;       удалить базу
// ! навигация в ubuntu
// ls
// cd
// cd ..     parent
// rm -r name      delete
// rm name     delete filed
// exit        выход

// ! node
// curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
// source ~/.profile
//
// # Установить последную версию
// nvm install node
// # Установить конкретную версию
// nvm install 14.17.3
// nvm use 14.17.3
// # Установить версию по умолчанию
// nvm alias default 14.17.3
// # Проверить активную версию
// node -v

// npm install -g pm2
// NODE_ENV=production pm2 start npm --name strapi -- run start # Запустить в режиме продакшн npm run start скрипт и назвать "strapi"
// pm2 status # Статус процессов
// pm2 logs # Показать логи приложения (Ctrl + C чтобы выйти)
// pm2 startup ubuntu # Запускать pm2 при рестарте системы
// pm2 save # Сохранить процесс чтобы при перезапуске сам запускался

// ! зависшие процессы
//
// jobs   ps  активные   kill %1  убераем
