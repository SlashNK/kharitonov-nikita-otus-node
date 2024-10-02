# Seminar M4L29: Node.js в продакшене (6.09.24)

## Стандартная схема развернутого веб-приложения

- На входе какой-то Load Balancer, они могут присутсвтовать на нескольких уровнях 
    - nginx
    - apache
    - HAProxy
    - cloud load balancers

- Нагрузка уже раскидывается по демонам (микросервисам и т. д.)


**Задачи**:

- Демонизация NodeJS instance
    - pm2
    - systemd
    - forever
    - docker/d-compose/d-swarm
    - k8s
    - serverless. Scheduler, Job Runner
    - Cloud Solution. Отдаем стороннему сервису docker image
- Масштабирование
    - Инструменты выше
- HTTPS!
    - [Let's Encrypt](https://letsencrypt.org/ru/) (из минусов, нужно перезапускать систему, чтобы сертификаты не портились).
    - Покупаем сертификаты
    - Настраиваем мониторинг!
- CI
    - линтеры
    - тесты
    - sonar qube на безопасность
- CD 
    - деплой
- IaC
    - Infra as code
    - Terraform, Pulumi, Ansible
- Мониторинг и логгирование
    - Мониторим метрики. Prom + Grafana. DataDogs.
    - Мониторим ошибки. Error tracing
    - ELK 
        - Elastic Search в базу данных логов
        - logstash
        - Визуализатор логов
    - portainer 


**[wait-for-it.sh](https://github.com/vishnubob/wait-for-it)** - bash скрипт, который проверяет (ожидает) доступность хоста и TCP порта. Может помочь в синхронизации при запуске созависимых сервисов (например связанных docker-контейнеров). Легковесный, без внешних зависимостей.
