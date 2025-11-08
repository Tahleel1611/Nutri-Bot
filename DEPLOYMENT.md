# Deployment Guide

This guide covers deploying NutriBot to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
- [Security Checklist](#security-checklist)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 14+ installed
- Python 3.10+ installed
- MySQL 5.7+ or MariaDB
- Reverse proxy (Nginx or Apache)
- SSL certificate for HTTPS
- Process manager (PM2 or systemd)

## Environment Configuration

### 1. Create Production .env File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

```env
# Database - Use production credentials
DB_HOST=your-production-db-host
DB_USER=nutribot_user
DB_PASSWORD=strong-random-password
DB_NAME=nutribot_prod

# JWT - CRITICAL: Generate a strong secret
JWT_SECRET=generate-a-very-strong-random-secret-at-least-32-characters

# Server
PORT=5000
NODE_ENV=production

# AI Service
AI_SERVICE_URL=http://localhost:5001

# Frontend
VITE_API_URL=https://your-domain.com/api/
VITE_AI_SERVICE_URL=https://your-domain.com/ai/
```

### Generate Strong JWT Secret

```bash
# Linux/Mac
openssl rand -base64 64

# Or Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## Database Setup

### 1. Create Production Database

```sql
CREATE DATABASE nutribot_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create Database User

```sql
CREATE USER 'nutribot_user'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON nutribot_prod.* TO 'nutribot_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Run Migrations

The application uses Sequelize auto-sync in development. For production, consider using migrations:

```bash
# Tables will be created on first run
# Consider using proper migrations for production
```

## Deployment Options

### Option 1: PM2 (Recommended for Node.js)

#### Install PM2
```bash
npm install -g pm2
```

#### Create Ecosystem File

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'nutribot-api',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'nutribot-ai',
      script: 'python3',
      args: 'app.py',
      interpreter: 'none',
      env: {
        PORT: 5001
      }
    }
  ]
};
```

#### Start Services
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Manage Services
```bash
# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Monitor
pm2 monit
```

### Option 2: Systemd Services

#### Create Node.js Service

`/etc/systemd/system/nutribot-api.service`:
```ini
[Unit]
Description=NutriBot API Server
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nutribot
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/nutribot/.env
ExecStart=/usr/bin/node /var/www/nutribot/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### Create Python Service

`/etc/systemd/system/nutribot-ai.service`:
```ini
[Unit]
Description=NutriBot AI Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nutribot
EnvironmentFile=/var/www/nutribot/.env
ExecStart=/usr/bin/python3 /var/www/nutribot/app.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Services
```bash
sudo systemctl daemon-reload
sudo systemctl enable nutribot-api nutribot-ai
sudo systemctl start nutribot-api nutribot-ai
sudo systemctl status nutribot-api nutribot-ai
```

### Option 3: Docker (Advanced)

Create `Dockerfile` for each service and use docker-compose for orchestration.

## Nginx Configuration

### Reverse Proxy Setup

`/etc/nginx/sites-available/nutribot`:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # AI Service Proxy
    location /ai/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        root /var/www/nutribot/dist;
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/nutribot/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nutribot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Security Checklist

### Before Going Live

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (min 32 characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set `NODE_ENV=production`
- [ ] Disable database remote access (if not needed)
- [ ] Set up firewall (UFW or iptables)
- [ ] Configure rate limiting on Nginx
- [ ] Set up fail2ban for brute force protection
- [ ] Review all error messages (no stack traces in production)
- [ ] Set appropriate file permissions
- [ ] Keep dependencies updated
- [ ] Set up automated backups
- [ ] Enable logging and monitoring
- [ ] Configure CORS properly
- [ ] Review and minimize API surface

### Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny internal services from external access
sudo ufw deny 5000/tcp
sudo ufw deny 5001/tcp
sudo ufw deny 3306/tcp

sudo ufw enable
```

## Database Backup

### Automated Backup Script

Create `/usr/local/bin/backup-nutribot.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nutribot"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u nutribot_user -p'password' nutribot_prod | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-nutribot.sh
```

## Monitoring

### Health Checks

Set up monitoring for:
- Node.js API: `https://your-domain.com/health`
- Python AI: `https://your-domain.com/ai/health`
- Database connectivity
- Disk space
- Memory usage
- CPU usage

### Logging

Configure centralized logging:
```bash
# PM2 logs
pm2 install pm2-logrotate

# System logs
sudo journalctl -u nutribot-api -f
sudo journalctl -u nutribot-ai -f
```

### Popular Monitoring Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Application Performance**: New Relic, DataDog
- **Log Management**: ELK Stack, Graylog
- **Error Tracking**: Sentry

## Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status nutribot-api
sudo systemctl status nutribot-ai

# View logs
sudo journalctl -u nutribot-api -n 50
pm2 logs nutribot-api --lines 50

# Check port availability
sudo netstat -tulpn | grep :5000
```

### Database Connection Issues

```bash
# Test database connection
mysql -u nutribot_user -p -h localhost nutribot_prod

# Check MySQL status
sudo systemctl status mysql

# Review MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### High Memory Usage

```bash
# Check process memory
ps aux | grep node
ps aux | grep python

# If using PM2
pm2 restart all

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/nutribot
sudo chmod -R 755 /var/www/nutribot
sudo chmod 600 /var/www/nutribot/.env
```

## Updates and Maintenance

### Updating the Application

```bash
# Backup first!
/usr/local/bin/backup-nutribot.sh

# Pull latest code
cd /var/www/nutribot
git pull origin main

# Update dependencies
npm install
pip3 install -r requirements.txt

# Restart services
pm2 restart all
# or
sudo systemctl restart nutribot-api nutribot-ai
```

### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit fix

# Update Python dependencies
pip3 install --upgrade -r requirements.txt
```

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Run multiple Node.js instances with PM2 cluster mode
- Separate database server
- Use Redis for session storage
- Use CDN for static assets

### Database Optimization

- Add appropriate indexes
- Set up read replicas
- Implement caching (Redis)
- Regular maintenance (OPTIMIZE TABLE)

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Search GitHub issues
4. Create new issue with detailed information

---

**Remember**: Always test deployment procedures in a staging environment first!
