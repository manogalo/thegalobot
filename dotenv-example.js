console.log('No value for FOO yet:', process.env.FOO);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log(process.env.BOT_USERNAME);
console.log(process.env.OAUTH_TOKEN);
console.log(process.env.CHANNEL_NAME);