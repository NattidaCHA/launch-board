FROM nginx:1.15-alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY dist /var/www/html