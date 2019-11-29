#FROM ubuntu:bionic
FROM node:12
LABEL authors="Hampus Holmström <hamhol-5@student.ltu.se>; Edvin Sladic <edvin@sladic.se>"

#RUN apt-get update && apt-get -y install curl gnupg2
#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
#RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
#RUN apt-get update && apt-get -y install yarn

#RUN mkdir -p /usr/src/app
#WORKDIR /usr/src/app

# copying all the files from your file system to container file system
COPY package.json .

# copy oter files as well
COPY ./ .

# install all dependencies
RUN yarn install

#expose the port
EXPOSE 3000

# command to run when intantiate an image
CMD ["yarn","start"]
