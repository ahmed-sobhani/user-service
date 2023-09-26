# User Microservice
This project is a user microservice built using NestJS, MongoDB, and provides CRUD operations for user management and authentication methods.

## Getting Started
### Prerequisites
Before you begin, ensure you have the following prerequisites installed:

- Node.js and npm
- MongoDB
- Docker (optional, for containerization)
- GitLab CI/CD Runner (for GitLab CI/CD)

### Installation
1. Clone the repository:

```bash
git clone https://gitlab.com/your/repo.git
cd user-microservice
```
2. Install dependencies:

```bash
npm install
```
3. Configure your environment variables. Create a .env file and set the required variables. You can use .env.example as a template.

4. Start the application:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker
Dockerize the application for easy deployment:

1. Build the Docker image:

```bash
docker build -t user-microservice .
```
2. Run the Docker container:

```bash
docker run -p 3000:3000 -d user-microservice
```

## Documentation
Generate API documentation using Compodoc:

```bash
npm run compodoc
```
View documentation by opening documentation/index.html in a web browser.

## Contributing
Contributions are welcome! Please follow the Contributing Guidelines.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to customize this README and the code to fit your specific project requirements. This template provides a starting point for building a user microservice with CRUD operations, authentication, NestJS, MongoDB, Docker, and GitLab CI/CD.