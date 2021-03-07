# RSSReact2021Q1-travel-app_backend

Backend for travel-app task

## Подготовка проекта:

1. npm init - для инициализации package.json
2. npm i -D typesript, tsc --init - установка и иниwиализации .json файла конфигуации typescript
3. npm i -D @types/express @types/node - типы для express a и node
4. npm i -D nodemon ts-node - nodemon для отслеживанияизменения фалов и атоперезапуска сервра при их изменении, ts-node для исполнения .ts файлов без транспилирования
5. npm i -S md5 @types/md5 - шифрование
6. npm i -S cors @types/cors - cors
7. npm i -S mongodb @types/mongodb - клиент для работы с mobgodb и типы для него
8. npm i -D pretier eslint eslint-plugin-import eslint-config-prettier eslint-plugin-prettier- форматирование кода, взаимная работа prettier и eslint [источник](https://www.robinwieruch.de/prettier-eslint). eslint --init для инициализации

## Проблемы и решения:

1. (Unable to resolve path to module)[https://stackoverflow.com/questions/55198502/using-eslint-with-typescript-unable-to-resolve-path-to-module]
2. ('The import path cannot end with a ".ts" extension)[https://stackoverflow.com/questions/59265981/typescript-eslint-missing-file-extension-ts-import-extensions]
3. Дебаг .ts фалов и обновление сервера nodemon требует настройки запуска дебага с запуском nodemon, для которого требуется завести конфиг nodemon.json и из него запускать ts-node посредством вызова скрипта из package.json.
