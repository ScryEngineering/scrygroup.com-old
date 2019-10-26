---
title: "Get HTTPS on your site for free!"
authors:
    - "Janis Lesinskis"
date: "2018-05-20"
tags:
    - SSL
    - encryption
    - web-development
    - security
contentType: "blog"
---

Now that [Letsencrypt](https://letsencrypt.org/) is offering free certificates in an easy to use way there's really no excuse for not having HTTPS on your site.

<!-- end excerpt -->

[HTTPS](https://en.wikipedia.org/wiki/HTTPS) is important because it gives you the ability to verify that the server you are connecting to is the server you thought you were connecting to and lets you communicate privately with that server. It does this by encrypting the communications between the web browser and the web server. In a practical business sense there are many ways in which this is important. HTTPS prevents eavesdropping on the connections with your clients. Say you were running an e-commerce store, would you want a 3rd party to be able to record all of your customers interactions and information then sell it to your competitors? HTTPS will prevent these types of issues. Many other [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) are prevented with HTTPS. For example when your customers attempt to connect to your site you don't want them to land on an impostor site that is pretending to be you. This is not a hypothetical either, such attacks are exceedingly common and the more successful you are the more adversaries will be incentivised to take advantage.

*From a security point of view HTTPS is a vital aspect of the web.*

But there are other ways in which HTTPS is important and they grow every year that passes. Now it is actually an important part of SEO as some [search engines will now rank your site less favorably without HTTPS](https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html). Browsers will loudly complain if your site is not set up with HTTPS in certain circumstances. Further there's add-ons such as HTTPS Everywhere that will simply refuse to load your pages if you do not have HTTPS enabled properly. Search engine changes and browser plugins a sign of where things are headed, sites without HTTPS are going to be at an increasing disadvantage as time goes on.

## Getting HTTPS set up

Setting up your servers with HTTPS properly takes a few steps, see [the guide over on EFF](https://www.eff.org/https-everywhere/deploying-https) for a good checklist of things you need to do. You need to set up your server then get an [encryption certificate](https://en.wikipedia.org/wiki/Public_key_certificate) that is signed by a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority) that the browsers will trust.

Once upon a time getting a certificate set up was a pain, you'd have to pay some amount of money and then you'd have to wait a while to get your certificate. Initially certificates were being processed in a somewhat manual manner which added a lot of time, and therefore cost, to the process. But now that almost all certificate issues are actually automatic anyway the cost is very high for the certificates that do not have any verification. But now there's a much better option that's free to use as well. Letsencrypt offers a service called [Certbot](https://certbot.eff.org/) that will get you a certificate. Since these certificates are automatically generated you'll need to be able to use the command-line to use this service. Some of the lower tier web hosting companies don't actually give you a command line access, in which case you are going to have to go to a lot more effort to get it working [via manual mode](https://certbot.eff.org/docs/using.html#manual). Consider the costs of upgrading to a service that does have a command line vs the extra amount you'll need to pay for a certificate. If your web hosting doesn't offer HTTPS at all then you really need to migrate off it since HTTPS is a requirement for any relevant hosting service in 2018.

The automated nature of the service is more convenient that the manual processes that were needed before. The only thing is that the certificates are valid for 90 days meaning that you will need to put some effort into automating your certificate renewals. Making sure your certificates are properly renewed is something that any serious service should have set up in any case with any certificate provider. We personally have a script that will email us when the certificate needs renewal.

## Outdated myths about HTTPS

Here's a couple of things that we have heard over the years that simply aren't true in 2018:

### It's expensive

Letsencrypt is free.

### HTTPS will be too much of a performance hit

Generally speaking almost anyone who has said this in the last few years has not actually done any benchmarking. If someone says the performance hit would be too much you should ask to see their benchmarks with the page load times, we would guess there aren't any.

Back in the 1990's [when HTTPS was being standardized](https://web.archive.org/web/19970614020952/http://home.netscape.com/newsref/std/SSL.html) I remember hearing people grumble about performance. The reason this might have come up then was because that was an era when server architecture was worse for encryption. In a general sense modern server hardware is so much faster than it was 20 years ago when the HTTPS standard were defined. But there's a more specific reason why this is likely to be a complete non-issue now and that's hardware supported encryption. For example on any modern Intel CPU you have the [AES-NI instruction set](https://en.wikipedia.org/wiki/AES_instruction_set) which will implement some cryptography functions in dedicated fast silicon. So while on average servers are much faster than they were 20 years ago in this specific case they are even faster than that average. Despite the high computational complexity these operations are exceedingly fast due to dedicated hardware support. AES-NI capable hardware has existed since 2008, with already over a decade of hardware support any new server you deploy on will be fine.

### Some browsers won't support it

HTTPS is ubiquitous enough now that if a browser doesn't support HTTPS you shouldn't be supporting that browser. In 2018 any browser that does not support HTTPS is fundamentally broken. In any case we haven't had any issues with HTTPS browser support in the last few years.