# Soulseek Whitelist

An [Aurral](https://github.com/lklynet/aurral) plugin that answers Soulseek whitelist bots for you.

Some people on Soulseek run bots like ProveIt that won't share until you reply to a message like this:

> To prove you are a human downloading these files, please type "download" in this chat to be added to my whitelist.

This plugin checks your active slskd conversations every 15 minutes, finds prompts like that, and sends the answer back. The next time Aurral picks that person as a source, the download goes through.

## Install

Needs an Aurral with plugins, currently nightly, and slskd connected in **Settings > Downloads**.

1. In **Settings > Plugins**, paste `https://github.com/lklynet/aurral-slskd-whitelist` under **Install from a link**, select **Check**, and choose **Soulseek Whitelist**.
2. Open it, select **Test**, and turn it on.

There's nothing to set. The plugin reads slskd's address and key from Aurral, which is why it asks for admin access.

## What it answers

Challenges that ask you to prove you're human, verify you're not a robot, or reply with a word to download, in any of these shapes:

- `type "download"`, `type the word "download"`, or `The keyword is "download"`
- `say > please give it to me <`
- `reply with the word: sparrow` or `Antworte nur mit diesem Wort: REMIXED`

The plugin answers each prompt once, skips prompts older than a day, and leaves every other message alone. If you already replied yourself, it stays out of it. It answers whether or not you have read the message, and never marks anything as read.

## Be a good peer

The person behind the bot asked for a human. If you use this, share back, and don't hammer people with downloads. If someone changes their bot to keep this plugin out, respect that.

## License

MIT
