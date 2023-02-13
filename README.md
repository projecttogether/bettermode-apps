# Bettermode Community Platform Apps

Custom apps for the bettermode community platform.

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Installation

This is an example of how to list things you need to use the software and how to install them. We assume that you have **npm** installed on your machine. We will use the `random-coffee-app` directory as an example.

1. Clone the repo
   `git clone https://github.com/projecttogether/bettermode-apps.git`

2. Navigate to the directory `cd random-coffee-app`

3. Install dependencies `npm install`

### Running locally

To run the script locally, run `node index.js`.

### Deploy to AWS Lambda

To deploy the function as a Lambda function to AWS Lambda we have to take the following steps.

1. Zip the needed files with `zip -r deployment_package.zip .`.
2. Upload the `.zip` file to AWS Lambda.
