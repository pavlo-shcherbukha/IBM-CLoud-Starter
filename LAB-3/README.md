# Просте Node.js Express побудоване на базы starter application

## Опис application
Це просте Node.js application що зв'язане з БД Cloudant

Має такі endpoints

- Перевірка, що живий (http-get):  /health
- Запуск swaggerUI (http-get): /swagger/api-docs
- Прочитати загружені курси валют (http-get): /exchrate?date=YYYY-MM-DD 
Дата може задаватися  в діапазоні з 2020-10-01 і до 2020-10-11 
Під час старту applicatation виконується загрузка курсів.

## Особливості

Для роботі з БД Cloudant  використовується Cloudant Node.js SDK  @ibm-cloud/cloudant

Для читання env-змінних в залежності від  різних  варіантів deployment використовується пакет: ibm-cloud-env

Порт, який слухаєтья задається в файлі ./server/config/local.json
Опис env-змінних, що використовуються для різних середовищ deployment описаний в файлі ./server/config/mapping.json, з врахуванням того, що при старті з laptop  запускаються ./server/localdev-config.json.

```json

{
  "cloudant_apikey": "",
  "cloudant_host": "",
  "cloudant_iam_apikey_description": "",
  "cloudant_iam_apikey_name": "",
  "cloudant_iam_role_crn": "",
  "cloudant_iam_serviceid_crn": "",
  "cloudant_password": "",
  "cloudant_port": 443,
  "cloudant_url": "https://",
  "cloudant_username": "" ,
  "dbname": "lab05"
}


```


У файлі **./server/controllers/cloudant-srvc.js** створений модуль підключення до Cloudant.

```js
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/server/config/mappings.json');

const fs = require('fs');
// Вычитывание конфигурации и подключение к БД
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const dburl= IBMCloudEnv.getString('cloudant_url');
const dbapikey= IBMCloudEnv.getString('cloudant_apikey');
const dbname=IBMCloudEnv.getString('dbname');


```

В неведеному фрагменті коду поаказано, що настройки не захардкоджені. Для параметризації параметрів пов'язаних (Binded) сервісів використовується пакет:

```js
   const IBMCloudEnv = require('ibm-cloud-env');
   IBMCloudEnv.init('/config/mappings.json');
```

А у файлі 

```javascript
   config/mappings.json
```
зберігається перелік параметрів та методі доступу до них.
Більш детально описано тут: [ibm-cloud-env](https://www.npmjs.com/package/ibm-cloud-env).
При старті з локальної станції, настройки вичитуються за файлу
```text
  config/localdev-config.json

```

-  Приклад задавання змінних

```bash
NODE_ENV=development
PORT=3001
# Set your database/API connection information here
API_KEY=XXXXXXX
API_URL=UUUUUUUu
watson_assistant_apiver=2019-02-28
watson_assistant_assistantid=fbf60170
```





