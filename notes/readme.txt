read about how connections are managed inside nodejs.
event emitters,
stream and buffer
epoll and kqueue
fds-socket discrptior
pipes
read about indexes in mongodb
why we should not create indexs so much
read about ref and populate


pm2 is a process manager which will run server on ec2 instance in backgroud so we dont need to run our server manually.
npm install pm2 -g
pm2 start npm -- start to start the server 
pm2 logs,pm2 list, pm2 flush <nameofprocess>, pm2 delete <processName>, pm2 stop <processName>
pm2 start npm --name 'devtinder-backend" -- start
go inside nginx - sudo nano /etc/nginx/sites-available/default
chnage the configuration
location /api/ {
        proxy_pass http://localhost:9090/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    now restart nginx sudo systemctl restart nginx
