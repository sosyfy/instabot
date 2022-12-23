const puppeteer = require('puppeteer')
const InstagramGetPosts = require('instagram-get-posts');
const mongoose = require('mongoose')

const Travel = require('./src/models/travel')
const Bulldog = require('./src/models/bulldog')
const Frenchie = require('./src/models/frenchies')



const { COOKIE_ACCOUNT_PASSWORD,USER_AGENT, COOKIE_ACCOUNT_USERNAME } = process.env;
let cookie = "" 
let cookies = "" 
let app_id = ""


const login = async () => {
    const ig_url = 'https://www.instagram.com'

    const puppeteer_options = { headless: false ,  ignoreHTTPSErrors: true}
    const browser = await puppeteer.launch(puppeteer_options);
    const page = await browser.newPage()


    await page.goto("https://www.instagram.com/");
    await page.setDefaultTimeout(0);

    await page.waitForSelector("input[name='username']");
    await page.waitForTimeout(2500);

    // Get the inputs on the page
    let usernameInput = await page.$("input[name='username']");
    let passwordInput = await page.$("input[name='password']");


    // Type the username in the username input
    await usernameInput.click();
    await page.keyboard.type(COOKIE_ACCOUNT_USERNAME, { delay :100 });

    // Type the password in the password input
    await passwordInput.click();
    await page.keyboard.type(COOKIE_ACCOUNT_PASSWORD, { delay :100 });
    await page.waitForTimeout(800);

    // Click the login button
    await page.click('#loginForm button[type="submit"]');
    await page.waitForTimeout(1000);

    let error_login = await page.evaluate(() => ((document.querySelector('p[data-testid="login-error-message"]'))?.innerText));

    if (error_login != undefined) {
        console.log('Error', error_login);
        await browser.close();
        process.exit(500);
    }
    await page.waitForNavigation();
 
  

    await page.goto(ig_url + '/' + COOKIE_ACCOUNT_USERNAME);
    await page.waitForSelector(`a[href='/${COOKIE_ACCOUNT_USERNAME}/followers/'`);

    cookies = await page.cookies();

    let csrf_token = cookies.filter((el) => (el.name === 'csrftoken') )[0].value;
    let mid        = cookies.filter((el ) => (el.name === 'mid') );
    let ig_did     = cookies.filter((el ) => (el.name === 'ig_did') );
    let ig_nrcb    = cookies.filter((el ) => (el.name === 'ig_nrcb') );
    let ds_user_id = cookies.filter((el ) => (el.name === 'ds_user_id'));
    let rur        = cookies.filter((el ) => (el.name === 'rur'));
    let datr       = cookies.filter((el ) => (el.name === 'datr'));
    let shbid       = cookies.filter((el ) => (el.name === 'shbid'));
    let shbts       = cookies.filter((el ) => (el.name === 'shbts'));
    let sessionid  = cookies.filter((el ) => (el.name === 'sessionid'));

    cookie = `mid=${mid[0].value}; ig_did=${ig_did[0].value}; ig_nrcb=${ig_nrcb[0].value}; csrftoken=${csrf_token}; ds_user_id=${ds_user_id[0].value}; datr=${datr[0].value}; shbid=${shbid[0].value}; shbts=${shbts[0].value};  sessionid=${sessionid[0].value}; rur=${rur[0].value}`

   
    let script_appId = await page.evaluate(() => {
        let scripts = Array.from(document.querySelectorAll('script'));
        let text = '';

        scripts.forEach(script => {
            if(script.innerText.includes('appId')) text = script.innerText;
        });

        return text;
    });

    let regx = /("appId":"\d*")/gm;
    let matchs = regx.exec(script_appId);


    app_id = matchs[0].split(':')[1].replace('"', '').replace('"', '');
   
    console.log(app_id);
}
const travelScrapper = async () => {
    try {
        const instagramGetPosts = new InstagramGetPosts({
            'cookie': cookie,
            'user-agent': USER_AGENT,
            'x-ig-app-id' :app_id
        });
    
        const accounts = [
            'travel.heavenss',
            'visit.the.america',
            'explorearizona',
            'hikingbangers',
            'maldiverss',
            'traveltobeautifulplacess',
            'belovedtravelz',
            'wonderofmaldives',
            'bestbeachspot',
            'travelingstraight',
            'explorearizona',
            'backpackerdestination',
            'travel.elegance'
             
        ]
    
        accounts.map(async account => {
            try {
                setTimeout(() => {}, 4000);
    
                let posts = await instagramGetPosts.getPosts({
                    profile: account, // profile from url instagram (https//www.instagram.com/rimemberchile/?hl=es-la)
                    maxPosts : 4,
                    postsType :'all', // type of posts to get, possible values ​​are image, video, all
                    getBase64 :true // indicates if you want to get the image as base64
                })
                  

                let newPostArr = posts?.map((post) => {
                    let linksArr = []
        
                    if (post.type === "video") {
                        linksArr = [post?.videoUrl]
                    } 
        
                    let postReturn = {
                        type: post.type,
                        likes: post.likes,
                        caption: post.caption,
                        comments: post.comments,
                        links: linksArr
                    }
                    return postReturn
                })
        
                await Travel.create([...newPostArr])  

            } catch (error) {
                
            }
           
    
    
        })
       
    
           
    } catch (error) {
       console.log(error);  
    }

   
}
const bulldogScrapper = async () => {
    try {
        const instagramGetPosts = new InstagramGetPosts({
            'cookie': cookie,
            'user-agent': USER_AGENT,
            'x-ig-app-id' :app_id
        });
    
        const accounts = [
          'bulldogusapage',
          'english_bulldog_loversofficial',
          'trainingbulldog_world',
          'english_bulldoglovers_',
          'bulldogtoyal',
          'bulldogwon'   
        ]
    
        accounts.map(async account => {
            try {
                setTimeout(() => {}, 4000);
    
                let posts = await instagramGetPosts.getPosts({
                    profile: account, // profile from url instagram (https//www.instagram.com/rimemberchile/?hl=es-la)
                    maxPosts :5,
                    postsType :'video', // type of posts to get, possible values ​​are image, video, all
                    getBase64 :true // indicates if you want to get the image as base64
                })
                  
                let newPostArr = posts?.map((post) => {
                    let linksArr = []
        
                    if (post.type === "video") {
                        linksArr = [post?.videoUrl]
                    } 
        
                    let postReturn = {
                        type: post.type,
                        likes: post.likes,
                        caption: post.caption,
                        comments: post.comments,
                        links: linksArr
                    }
                    return postReturn
                })
        
                await Bulldog.create([...newPostArr])  

            } catch (error) {
                
            }
           
    
    
        })
       
    
           
    } catch (error) {
       console.log(error);  
    }

   
}
const frenchieScrapper = async () => {
    try {
        const instagramGetPosts = new InstagramGetPosts({
            'cookie': cookie,
            'user-agent': USER_AGENT,
            'x-ig-app-id' :app_id
        });
    
        const accounts = [
           'frenchbulldoglovers6589',
           'frenchieclubs',    
        ]
    
        accounts.map(async account => {
            try {
                setTimeout(() => {}, 4000);
    
                let posts = await instagramGetPosts.getPosts({
                    profile: account, // profile from url instagram (https//www.instagram.com/rimemberchile/?hl=es-la)
                    maxPosts :10,
                    postsType :'all', // type of posts to get, possible values ​​are image, video, all
                    getBase64 :true // indicates if you want to get the image as base64
                })
                  
               
                let newPostArr = posts?.map((post) => {
                    let linksArr = []
        
                    if (post.type === "video") {
                        linksArr = [post?.videoUrl]
                    } else {
                        if (post?.imageUrl) {
                            linksArr = [post?.imageUrl]
                        } else {
                            linksArr = post?.images
                        }
                    }
        
                    let postReturn = {
                        type: post.type,
                        likes: post.likes,
                        caption: post.caption,
                        comments: post.comments,
                        links: linksArr
                    }
                    return postReturn
                })
        
                await Frenchie.create([...newPostArr])  

            } catch (error) {
                
            }
           
    
    
        })
       
    
           
    } catch (error) {
       console.log(error);  
    }

   
}



const scrap = async ()=>{
    try {
        await login();  
        await travelScrapper();
        await frenchieScrapper();
        await bulldogScrapper();
    } catch (error) {
        
    }
   
}

module.exports = scrap







