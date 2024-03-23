
# GitHubWebHook 

This is a Express script that listens to (POST) requests on /webhook and runs a bash script if payload and secret match, with the intent of deploying new code.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SECRET` Github webhook secret

`PORT`  Port where express server will listen for requests


## Deployment
Steps for deploying this script

1. Clone this repo
2. run
```bash
  npm install
```
3. Rename .env.example to .env and update the settings (remember secret on .env **must** match the one on the webhook setup )
4. Rename update.sh.example and insert what commands are needed to perform a deployment.

5. Run the script with
 ```bash
  node .
```

## Running with systemd
Here's a systemd template that it could be used to run this script at startup (as a process):
```
[Unit]
Description=Script that auto deploys code when a new push is made on remote
Documentation=https://github.com/diogocardoso28/GitHubWebHook
After=network.target

[Service]
Type=simple
#Be careful with user permissions
User=your_user
WorkingDirectory=path_to_script
ExecStart=path_to_node_bin/node --env-file=.env main.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
place the template on the follwing path:
```
/lib/systemd/system/GitHubWebHook.service
```

## Authors

- [@diogocardoso28](https://www.github.com/diogocardoso28)

