---
title: "Site relaunch"
date: "2018-04-21"
tags:
- gatsby
- drupal
- CMS
- web-development
contentType: "blog"
callToActionText: "Are you interested in improving the technology that powers your websites? Fill in the form below with some details about your needs and we can start a discussion about what would most effectively meet your needs while giving you room to scale."
hideCallToAction: false
---

We have re-launched the site with a new technology, [Gatsby.js](https://www.gatsbyjs.org/).

We did this for a few reasons, most notably that we were actively searching for alternatives to WordPress for clients and unfortunately had a bunch of issues with regards to the old Drupal powered site. Given these two things it seemed to make sense to investigate other options in the Content management systems (CMS) space.

The site is a bit unpolished at the moment because we needed to release fast. Instead of patching the various severe Drupal security issues just to abandon that platform very soon afterwards we decided it was best to just push the release of our new site forward a few days. We started writing the new site as soon as we saw [this security report](https://groups.drupal.org/security/faq-2018-002) so we already had a significant amount of the work done.

Instead of just taking another off the shelf CMS that had it's own opinionated approach to front end we decided to roll our own site using GatsbyJS. This made a lot of sense for *us* because it allows us to develop basically whatever we want when we need it. We have a significant amount of development skill in house so having a developer-oriented web framework was a big positive. But this wouldn't have been a good choice for *everyone* because a [JAM stack](https://jamstack.org/) approach such as this requires comfort with ReactJS, markdown files and version control. Even if you were familiar with these technologies doing re-writes is still an expensive endeavour, and our general guideline is that you need really good reasons to do a re-write. In this case we felt the benefits of a re-write were compelling and we figured that it would be helpful to write about the reasoning behind our choice.

# Business benefits

The reason we chose a different technology for our site was a primarily a business decision. Initially we wanted to get a site up fairly quickly and we saw using an existing CMS offering as a good way to do that. And as an *interim* solution that wasn't the worst, we got something up quickly. Using Drupal let us get a placeholder site up quickly, but then the operational costs started to kick in. Keeping the service running and up to date with security patches was expensive. The trade we were making for a quick deployment was that it was costing us a lot of time in maintenance and higher costs for hosting. Additionally since these CMSes are targeted fairly heavily by malicious agents it appeared to lock us in to a security maintenance process forever.

From a business strategy point of view we looked at this time cost and decided that it would be a good idea to invest in a different system with a lower total cost of ownership over the lifetime of a site. An astute reader might be thinking here "but reimplementing in a whole new technology stack is going to take a lot longer than just keeping a off-the-shelf CMS up and running", and this thought would be right over a short time window. But even over that short window we are getting substantial benefits in our other projects from this work. For a business that was not in the business of technology the costs of a such migration would be higher because you would need to be contracting out that work, and contracted custom web development is expensive.

However our business *is* technological consulting so we could fill in our dead-time in the consulting work with work on this site. This provided us with an important opportunity to learn about how to address clients needs in the CMS space. Since many clients and collaborators are using these existing CMS platforms we are frequently asked what the how to making these systems more secure or what the options are for migrating to a more secure platform. By investing the time in making such a transition ourselves we have put ourselves in a much better position to offer such a transition of service to our clients, including the ability to reuse large amounts of the work we did on this site.

In order to get a better estimate of the costs and benefits of this approach we sought out advice from some technical leaders in the web development industry in our network to see what successful businesses are doing in this space. As a result of those talks we decided to move our site platform over to GatsbyJS because this both made our life easier and opened up the most potential value for the work we are doing with our clients.

## Cheaper security

A large part of the cost of running a WordPress or Drupal site come in the form of the maintenance burden of updates, plugins that break and security work that is needed to mitigate the risks of the deployment. Ultimately the content on your site gets to be worth many multiples of the cost of the site itself, so keeping this safe is paramount.

Unfortunately with some CMS offerings even when you are on top of these things you can still get your site compromised, I know of many sites that have kept up with updates and have still got cracked, which is highly unfortunate. Having your site defaced or the data of your clients leaked definitely comes with a cost. Having a platform that had significant risks of getting compromised even if up to date with security patches was a non-starter for us.

You have to factor in the costs of your site getting hacked if you self-host WordPress or Drupal and the associated clean up required (unfortunately even if you are on top of these maintenance tasks you are *likely* to have your site compromised at some point). So you'll need to factor in at least the time restoring from backups to get your site back up and the costs of that downtime. You will also need to set up a backup system and test that it works. You might also face harder to quantify reputational losses from your site getting defaced or having your servers sending out spam. Alternatively you can pay a service for more secure hosting of these platforms. But you either pay for these service with subscriptions or you pay with employee time, ongoing maintenance costs are unavoidable with these platforms.

Some of the people we know in the industry really jump through hoops to enable clients to use WordPress, often to support existing installs. However jumping through these hoops is expensive, something that is economically unfavorable for hosting an individual deployment. If you are wishing to run a single site we would suggest a hosted service that takes care of the operational requirements. This is because the monthly fee will be lower than the cost of handling it in-house due to the economies of scale that such a provider can provide with managed hosting. They *should* be able do this more effectively via a combination of centralized expertise and the ability to apply fixes to multiple clients simultaneously.

## Cheaper hosting

Because you don't need a database to back things up it's way cheaper to host the site this way, the only requirement now is a working Nginx or Apache instance. There's a lot of cost benefits of this site architecture. You can get by with much cheaper servers to host the site.

With a global CDN this will have the nice benefit of speeding up your page load times and making your site less vulnerable to denial of service attacks.
You can also put the files on a (Content Delivery Network) CDN and then avoid the costs of running your own loadbalancers.
Then if you wrote some good content you will also be able to [survive the load spike that comes with being on the front page of a popular aggregator like Hackernews](https://news.ycombinator.com/item?id=8107658) without it taking your site down.

Additionally risks of compromises on cloud services can be very expensive if you are being billed based on your usage. [Attackers are now installing cryptocurrency mining on compromised machines more than ever before](https://www.infosecurity-magazine.com/news/cryptominers-replace-ransomware/) so you could rack up quite a large bill if you are being billed on the amount of processing power used if your site gets compromised in this way. Good security can save you a lot of money.

# Technical benefits

The technical benefits for us with this approach are really substantial. On the GatsbyJS website there is a good [summary of the features of GatsbyJS platform compared with others CMS offerings](https://www.gatsbyjs.org/features/) in that space but here's a quick summary of what mattered to us and why:

## Page load times

The page load times we have are now super fast compared with our old system, and we haven't even set up a CDN yet! Because there's no expensive database calls to deal with pages load really fast. If we get more traffic we might set up a CDN, but because the site is so fast already we don't need to just now. But if we do need a CDN it will be super easy to use one because the platform works great for that out of the box.

## Code reuse across all of our web clients and projects

This framework has really good interoperability with various existing Content Management Systems. By having a known set of real-world tested code we can rely on we have the ability to make improvements on one project benefit our other projects.

By using a system with fewer moving parts that has fewer security and deployment concerns we feel much more confident that the client sites will function properly and have lower support costs.

### Can use existing React components

There's a lot of React components out there and being able to reuse them is a really big win. We like to write less code when possible. Related to this we can now reuse the components we made for this site which will make it quicker to create other client sites.

### Can pull data from headless CMS sources

Gatsby has support for pulling data directly from WordPress and other sources. This means you can install WordPress in a headless setup and firewall it off from everything else. Now you can capture the value of those other systems while simultaneously reducing the lock-in factor to the themes systems found there.

We suspect this will be an important migration path option for clients in the future.

## No database to maintain

Our database crashed a few times, which meant that there was some site downtime, something we would very much rather avoid.

Seeing as we don't need to have a database at all for this site we can have fewer "moving parts" by statically generating the entire site. Less moving parts means less operational costs!

## Local development is easier

Because you don't need a database behind a static site you can set up local development much more easily.

We have a virtual machine setup as a base for developing in Gatsby which we put on GitHub: https://github.com/customprogrammingsolutions/gatsbyjs-vagrant

We found it was much easier to get up to speed with local development on a new box as a result. If you have any issues with our VM please [open an issue](https://github.com/customprogrammingsolutions/gatsbyjs-vagrant/issues) over on GitHub and we will try to help you out.

## Deployments are much easier

Because there is no database to maintain it is very easy to deploy the site. You just need to build the live site and send the files up to staging then to deploy to live.

Because this is just files being pushed around you don't need any of the worries associated with versioning of CMS packages either. The production-built site is completely self contained.

## Backup is essentially free

Because we have markdown and other static assets we just use our version control system (Git) to keep track of content changes. Because we are mostly just dealing with static pages at a relatively low volume this works fine for us. This probably could scale up enough to meet our future needs too. If for some reason we needed a more complex authoring workflow this could become inappropriate, but we can cross that bridge when we get to it. (At that point we would likely switch to using Wagtail or similar as a CMS backend, because we could leverage the existing CMS work they have done. We would then pull out the data from that backend into our existing front end. Note the ability to change the backend without losing any of our existing front end code base value.)

Unfortunately backups have been a bit of a pain point when using some other systems. Setting up the backups with Drupal was a pain, the initial drupal 8 install we had didn't come with a CLI. So we wanted to install the CLI but the CLI needed Drush, so we installed that just to find out that you couldn't use the CLI with a Drupal install that wasn't made with composer. We had already thrown away multiple hours at this point to get to square 0 which meant a complete reinstall of the site to get easy CLI "cron-job"able backups, oh and we still had to backup the existing site without the CLI which meant dumping out data from the database with SQL directly. The default Drupal 8 install not coming with CLI support strikes me as a rather bad developer experience point. Since we already use Git backups of the content were essentially free with the static site approach.

# Downsides

It would be disingenuous to say there are no downsides for this approach, overall from the perspective of our teams skills we find this to be a good match, hence why we use this, but it is not for everyone. If your team didn't have experience with ReactJS and GraphQL it would be a learning expense to get people up to speed. Even knowing the requisite technologies there are a few downsides to this approach that are likely to apply to any team. The biggest downside we find is that the editor experience isn't integrated into the site. We have a few people who we collaborate with that aren't technical and it would make it harder for them to contribute. They are super smart professionals so we have no doubt that they would be able to pick up the skills to edit markdown files in a very short amount of time but Git would be harder as it would take them some time and their time is money.

So right now if anyone needed to post something and didn't know how to use Git we would just accept an email and then post it up for them. This of course wouldn't scale to a huge number of non-technical collaborators but all main contributors to our site can use Git effectively so this is a non issue *for us*. If we got a large number of non-technical collaborators we would set up some form of a drop-off-box so that files could be uploaded outside the usual Git workflow, with some tooling to moderate the content before committing the new files in. We would happily help people learn more about Git but we appreciate that people have a lot on their plates already.

One thing that has to be said in favor of WordPress is the editor experience is good. It lets people work on articles with a minimal amount of learning time required. Specifically the ability to copy and paste from other sources and preserve formatting is very nice. We would likely use the WordPress editor for content creation and hook this up to a static site generator if our client was non-technical.

We are working on a way to give people a nice editor experience while retaining the benefits of a static site deployment such as this. However it is a work in progress right now, if this would benefit you [let us know](/contact) and we might be able to bump up the priority of this work.