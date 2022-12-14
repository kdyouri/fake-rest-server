# Fake REST-Server

Fake REST-Server is an install and run tool for testing. It supports GET, POST, 
PUT, PATCH and DELETE HTTP methods with JSON format on request and response.

# Installation

```sh
npm i -D @kdyou/fake-restserver
```

# Usage

```sh
npx fake-restserver
```

| Parameter     | Description  | Default |
|---------------|--------------|---------|
| `--port=3000` | Server port (Optional) | `8000`  |

# Examples

Start Fake REST-Server, then run curl on a new terminal:
```sh
curl -X POST -d '{"first_name":"John","last_name":"Smith","email":"johnsmith@mailer.net"}' http://localhost:8000/students
```

You can now get your data:
```sh
curl http://localhost:8000/students
curl http://localhost:8000/students/1
```

And do some update:
```sh
curl -X PUT -d '{"first_name":"John","last_name":"Smith","email":"johnsmith@mailer.net"}' http://localhost:8000/students/1
curl -X PATCH -d '{"email":"johnsmith@mailer.net"}' http://localhost:8000/students/1
curl -X DELETE http://localhost:8000/students/1
```
