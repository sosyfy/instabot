const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();
const cron = require("cron");
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const axios = require('axios')
const Travel = require('./src/models/travel')
const Bulldog = require('./src/models/bulldog')
const Frenchie = require('./src/models/frenchies')
const scrap = require('./scrapper')
const mongoose = require('mongoose')

const { IG_USERNAME, IG_PASSWORD, MONGO_URL, PORT, COOKIE_ACCOUNT_PASSWORD, COOKIE_ACCOUNT_USERNAME } = process.env;
let randomMinute = Math.floor(Math.random() * 60);

const login = async () => {
  try {
    ig.state.generateDevice(IG_USERNAME);
    await ig.account.login(IG_USERNAME, IG_PASSWORD);
    console.log(ig);

  } catch (err) {
    console.error(err);
  }
};




const connectToDb = async () => {
  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6 
  }).then(
    console.log("DB CONNECTED SUCCESS")

  ).catch(error => {
    console.log("DB CONNECTION FAILED ", error)
    process.exit(1)
  })
}






if (IG_USERNAME && IG_PASSWORD && COOKIE_ACCOUNT_USERNAME && COOKIE_ACCOUNT_PASSWORD) {
  try {
    connectToDb()

    new cron.CronJob({
      cronTime: `${randomMinute} ${Math.floor(Math.random() * 12)} 1-31/3 * *`,
      onTick: () => { scrap() },
      start: true
    });
  
  
    const postRandom = async () => {
  
      await login()
  
      const posts = await Travel.find().limit(1).sort({ likes: -1 })
  
      posts.map(async post => {
  
        let mediaBuff = post.links.map(link => {
          return new Promise((resolve, reject) => {
  
            resolve(axios.get(link, { responseType: 'arraybuffer' }).then((res) => {
              return res.data
            }));
          });
  
        })
  
        let mediaBuffers = await Promise.all(mediaBuff)
  
        if (post.type === "video") {
          await ig.publish.video({
            file: mediaBuffers[0],
            caption: post.caption
          })
        } else {
  
          if ( mediaBuffers?.length > 1) {
            await ig.publish.album({
              items: mediaBuffers.map( item =>({
                 file: item,
              })),
              caption: post.caption,
            })
          } else {
            await ig.publish.photo({
              file: mediaBuffers[0],
              caption: post.caption
            })
          }
  
        }
      })
  
  
    }
  
  
  
    new cron.CronJob({
      cronTime: `${randomMinute} 0-23/1 * * *`,
      onTick: () => {
        // Perform the task here
        postRandom();
        randomMinute = Math.floor(Math.random() * 60);
      },
    });
  
  } catch (error) {
     console.log(error);
  }
 

} else {
  console.warn(
    "IG_USERNAME, IG_PASSWORD are required to run the script"
  );
}

app.get("/", async (req, res) => {
  console.log("tried");
});

app.listen(PORT || 3001, () => {
  console.info("Server started.");
});