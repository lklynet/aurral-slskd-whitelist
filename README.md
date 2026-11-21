# Soulseek Whitelist

An [Aurral](https://github.com/lklynet/aurral) plugin that answers Soulseek whitelist bots for you.

Some people on Soulseek run bots like ProveIt that won't share until you reply to a message like this:

> To prove you are a human downloading these files, please type "download" in this chat to be added to my whitelist.

This plugin checks slskd's private messages every 15 minutes, finds prompts like that, and sends the word back. The next time Aurral picks that person as a source, the download goes through.

## Install

Needs an Aurral with plugins, currently nightly, and slskd connected in **Settings > Downloads**.

1. In **Settings > Plugins**, paste `https://github.com/lklynet/aurral-slskd-whitelist` under **Install from a link**, select **Check**, and choose **Soulseek Whitelist**.
2. Open it, select **Test**, and turn it on.

There's nothing to set. The plugin reads slskd's address and key from Aurral, which is why it asks for admin access.

## What it answers

A message counts when it mentions a whitelist and says to type a single quoted word, like `type "download"`. The plugin answers each prompt once, skips prompts older than a day, and leaves every other message alone. It never marks messages as read, so you still see them in slskd.

## Be a good peer

The person behind the bot asked for a human. If you use this, share back, and don't hammer people with downloads. If someone changes their bot to keep this plugin out, respect that.

## License

MIT
