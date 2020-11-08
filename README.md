# Laertes

## About
**Q:** What is Laertes? 
**A:** Laeters is a personal project to rebuild [ophelia](https://github.com/siggame/ophelia) from the ground up.

**Q:** Why rebuild ophelia?
**A:** I have a couple of motivations on why I would like to rebuild ophelia. 
1. In it's current state it can be confusing for newer members to start working on the project due to the complexity of setup and high point of entry due to a bunch of packages thrown together to make something work. I would like, and hope, that this rebuild is a little easier to get started with. 
2. It has a couple of weird bugs that I don't really feel like addressing in the current state. 
3. It is difficult to make any changes without doing a code push
4. I just want another project :) 


 ## Technologies
 In selecting these technologies I wanted something that was used across various industries while still being easy to use/deploy.
 ### Frontend
 - [Next.js](https://nextjs.org/)
 -- A [React](https://reactjs.org/) framework that has a lot of built in features
### Backend 
- [PostgresSQL](https://www.postgresql.org/)
-- Open source object-relational database with 30+ years of active development

### Hosting
- [Vercel](https://vercel.com/)
-- A hosting service created by the developers of Next.js 
-- Hosts the frontend code and offers deployment of [serverless functions](https://vercel.com/docs/serverless-functions/introduction)
-- Easy to use and setup, offers preview builds for branches that are a work in progress
-- Automatic deployments once code is merged into master
-- Free! [^1]

- [AWS](https://aws.amazon.com/e)
-- I'm currently using an AWS RDS instance on the free tier but you can use any host that supports mysql
## Setup
### Windows
1. [Download and setup a windows subsystem](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
-- On step 6 I would use Ubuntu 18.04 LTS
2. [Install Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started)
3. Open up the terminal and open a new tab with ubuntu. 
4. Create a new directory `mkdir ~/dev/`
-- **NOTE: Do not use the default /mnt location. It is slow and it does not detect file changes in it's current state**
5. Navigate to the new directory `cd ~/dev`
6. Clone the repo `git clone git@github.com:dnhess/laertes.git` or `git clone https://github.com/dnhess/laertes.git` 
-- I reccomend the first option... [here](https://devconnected.com/how-to-setup-ssh-keys-on-github/) is how to set up ssh keys for github
7. Navigate to the cloned repo `cd laertes`
8. You are now going to have to install node. In your ubuntu terminal run the following:
-- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash` <-- pulls down and runs the installer for nvm
-- `source ~/.bashrc` <-- Reloads bash to see the new command `nvm`
-- `nvm install stable` <-- Installs the latest stable version of node
9. Start up the localhost environment `npm run dev`

### Mac
1. Clone the repo `git clone git@github.com:dnhess/laertes.git` or `git clone https://github.com/dnhess/laertes.git` 
-- I reccomend the first option... [here](https://devconnected.com/how-to-setup-ssh-keys-on-github/) is how to set up ssh keys for github
2. Navigate to the cloned repo `cd laertes`
3. Ensure you have node installed `node -v` if not we need to install it: 
-- `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"` <-- installs homebrew (a package manager)
-- `brew install node` <-- installs node
4. Start up the localhost enviornment `npm run dev`


[^1]: Up to a certain point... we should never hit the free plan limitations
[^2]: Once again.. up to a certain point. I don't think we will hit the limitations if the other things are setup correctly