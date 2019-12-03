FROM node:12
LABEL authors="Hampus Holmström <hamhol-5@student.ltu.se>; Edvin Sladic <edvin@sladic.se>"

# copy all files
COPY ./ .

# install all dependencies
RUN yarn install

#expose the port
EXPOSE 3000

# command to run when intantiate an image
CMD ["yarn","start"]
