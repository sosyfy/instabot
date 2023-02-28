# Instagram Bot

A bot that scrapes Instagram posts and automatically reposts them on a schedule using a cron job. Built with Node.js and Express.

## Summary

The Instagram Bot is a tool that allows users to automatically repost content from Instagram on their own account. It works by scraping posts from a specified Instagram user or hashtag and then reposting them on a schedule using a cron job. This can save time and effort for users who want to repost content from other accounts without having to manually find and share the posts. The bot is built using Node.js, a popular JavaScript runtime, and Express, a web framework for Node.js, which allows for easy access to Instagram's data.

## Features

- Scrapes posts from a specified Instagram user or hashtag
- Reposts scraped posts on a schedule using a cron job
- Built using Node.js and Express
- Can save time and effort for users who want to repost content from other accounts
- Easy to set up and use

## Getting Started

1. Clone the repository: `git clone https://github.com/sosyfy/instabot.git`
2. Install dependencies: `npm install` or `yarn`
3. Set up your Instagram Private API credentials in the `.env` file
4. Run the script: `node index.js` or `npm start` or `yarn start`
5. Specify the Instagram user or hashtag you want to scrape and the cron schedule for reposting

## Dependencies

- Node.js
- Express
- Cron
- Instagram Private API (npm package)

## Contributions

Contributions are always welcome! If you have any suggestions or find a bug, please open an issue or submit a pull request.

## Note

Please be aware that scraping Instagram's data violates their terms of use. It is recommended that you use this bot for educational purposes only and to be careful when using it.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
