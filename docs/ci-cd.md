# An Overview of our CI/CD Pipeline

This part of the documentation is meant to give an overview of how our project is built, tested, and deployed using CircleCi, Github Actions, and Docker.

?> The **Flexion** CircleCI link can be found [here](https://app.circleci.com/pipelines/github/flexion/ef-cms)

?> The **Tax Court** CircleCI link can be found [here](https://app.circleci.com/pipelines/github/ustaxcourt/ef-cms)

## CircleCI

A majority of CI/CD pipeline is currently ran in Circle CI.  Circle is hooked up to our repository and reads a [.circleci/config.yml](https://github.com/ustaxcourt/ef-cms/blob/staging/.circleci/config.yml) file to determine what to build and test.  This file can be broken down into 3 main sections:

- **commands** - these are used for abstracting away reusable pieces of setup that other **jobs** might need to invoke.  
- **jobs** - these are the smaller building blocks of a **workflow**.  For example, a single build workflow might have a job for linting, a job for testing, a job for e2e tests, etc.  Jobs are broken down into individual **steps**.
- **workflows** - allows us to create a dependency graph of **jobs**.  For example, when we merge a PR into `develop`, we need to make sure all of the testing passes before we move onto the next job to `deploy` the code.  A workflow is broken down into multiple **jobs** which will all run in parallel unless a **requires** property is defined on the job.

In our Dawson project, we have defined two main workflows:

- **build-and-deploy** - this workflow is used for building, testing, and deploying our application
- **build-and-deploy-with-context** - this workflow is idential to the build-and-deploy workflow, except we use this workflow for the prod environment since we have different AWS credentials needing for prod which are setup in a different [CircleCI context](https://circleci.com/docs/2.0/contexts/).  The reason we have a context is because prod has a separate AWS account isolated from all of the lower environments.

When someone commits a to a branch in our repository, CircleCi will run this **build-and-deploy** workflow to start running all of the tests against that commit.  Notice that the jobs in the workflow have properties called **requires** and **filters**.

- **requires** - specifies the previous step which must pass before that step is ran
- **filters** - specifies which branch this step should run in

For example, here is what our migrate job looks like:

```
- migrate:
    requires:
        - deploy
    filters:
    branches:
        only:
        - develop
        - irs
        - staging
        - test
        - experimental1
        - experimental2
        - experimental3
        - experimental4
        - experimental5
        - migration
```

This is saying the migrate job should only run directly after the deploy job is successful, and only on the defined branches.

### Executor 

When running a job in circle, you have the option to run on either a VM or a container.

When you see the `machine` property on a job configuration, that means it's running directly in a linux VM instance.  We use the `machine` executor when we need to build docker containers during our build process.  Using docker_layer_caching will speed up the container we are building if it's already been built on that machine executor.

```
    machine:
      docker_layer_caching: true
```

The other executor is the `docker` executor.  When using this exector, you can actualy string together multiple docker containers which will all be accessible during your build. For example, our e2e-cypress-public job is a docker executor which runs 3 separate docker `images`.

```
e2e-cypress-public:
    docker:
        - image: $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest
        - image: amazon/dynamodb-local
            command: ['-jar', 'DynamoDBLocal.jar', '-inMemory']
        - image: elastic/elasticsearch:7.8.1
```

This first image of this job is where our steps of the job will execute, but the other two images are used for hosting dynamodb in a container and also elasticsearch in another container.  We use these pre-existing containers to speed up our build process instead of having to download and install dynamo and elasticsearch on every build ourselves.

### Permissions

In order to allow CircleCi to access and modify resources in our AWS account, we needed to setup and manage an IAM user with the correct permissions and store the access tokens as circleci environment variables.  The roles and policies for this CircleCI user are managed via terraform, and more specific they are configured in this [iam/terraform/account-specific/main/circleci.tf](https://github.com/ustaxcourt/ef-cms/blob/staging/iam/terraform/account-specific/main/circle-ci.tf) file.

When an admin runs the `npm run deploy:account-specific` command, these permissions will be created and updated.  If you find there is a new resource circleci needs access to modify, you need to update this circle-ci.tf file and then re-run terraform locally on your machine.

## Github Actions

Due to the high cost of CircleCI, there is an effort to try to transition our builds over to github actions since they are free for public repositories.  Right now we use GitHub Actions to run some things such as linting the project, running the unit tests, and verifying some scripts.  The main reason we haven't switched everything over to GitHub actions just yet is because a lot of our heavy lifting tasks, such as Pa11y and our integration tests require a lot of memory to run.

All of our actions are defined in [.github/workflows](https://github.com/ustaxcourt/ef-cms/tree/staging/.github/workflows).  There is a separate .yml file for each individual action.  Similar to CircleCi, an action is defined in a yml file and is broken down into various `steps`.  You can specify when the job runs (such as on pull_requests), and also specify which version of node to test on, which docker image (ubuntu-latest), and also run community ran actions if needed.

Here is an example of our `test:client:unit` action:

```yml
# client.yml
name: Node.js CI
on: [pull_request]
jobs:
  Client:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x]
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: NPM Install
        run: npm ci --no-optional && npm rebuild
      - name: API
        run: npm run test:client:unit
```

## Docker

We use docker on our project to build some of the images we need in the CI/CD pipeline.  A majority of the circle jobs require running in a docker container, which means we needed to specify which image circle should use.  We build the [Dockerfile-CI](https://github.com/ustaxcourt/ef-cms/blob/staging/Dockerfile-CI) and publish it to our AWS ecr repository whenever we need to update some of the dependencies.  The script [docker-to-erc.sh](https://github.com/ustaxcourt/ef-cms/blob/staging/docker-to-ecr.sh) can be use to build and publish the latest version of our CI image.

We also a separate image called [Dockerfile](https://github.com/ustaxcourt/ef-cms/blob/staging/Dockerfile) for the deploy jobs of our circle since we don't care about cypress when doing deploys.  This image is build and ran using the machine executor in circle, so you don't have to worry about manually building and deploying this image.

?> This documentation isn't meant to cover docker in detail, so please read the [Docker Getting Started Guide](https://docs.docker.com/get-started/) if you want a more in depth breakdown of docker.  

The gist of docker is you can build images using `docker build -t YOUR_IMAGE_TAG -f YOUR_DOCKERFILE .` which will basically build an image and provide it access to all of the files in the same working directory.  After you've built the image, you can run it via `docker run YOUR_IMAGE_TAG`.  Often you need to pass additional flags to `docker run` such as the port `-p 8080:8080` flag to expose certain ports, or `-e "MY_ENV=hello"` to pass in environment variables for the container to use.  The docker definition file usually has a `CMD` line which states what command will execute when you run the container.  In Dawson, we often overwrite this cmd using `/bin/sh -c "npm run start"` command line option which will run whatever script we want inside the container.