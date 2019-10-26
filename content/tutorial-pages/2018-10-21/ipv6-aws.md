---
title: "Enabling IPv6 on an AWS VPC in the management console"
authors:
    - "Aapeli Vuorinen"
date: "2018-10-21"
tags:
    - aws
    - IPv6
contentType: "tutorial"
---

Want those sweet, sweet 128-bit addresses for your AWS services?

<!-- end excerpt -->

So you need IPv6 support for your services running on AWS?

Maybe the world is doomed and we're running out of IPv4 addresses, or maybe you're just very hipster, or maybe you think 128-bit addresses just look cooler than 32-bit addresses.

Whatever the reason, here's a quick guide to getting IPv6 working on AWS.

## Allocate an IPv6 CIDR to the VPC

Navigate to `Services > (Networking & Content Delivery) > VPC`. Then click on `Your VPCs` in the left hand menu column.

Select the VPC you want to enable IPv6 for, and right click to press `Edit CIDRs`, then click `Add IPv6 CIDR`.

This will assign a `/56` block of IPv6 addresses for that VPC (that is, \\(2^{128-56}\\), or \\(2^{72}\\) addresses).

## Allocate an IPv6 CIDR to the subnet

Now head to the `Subnets` panel in the left hand menu column.

Again, right click on the subnet you want IPv6 addresses for, and click `Edit IPv6 CIDRs`.

Now enter in a number between `00` and `ff` in the box (this must be unique for each subnet).

This will associate that `/64` block of IPv6 addresses to that subnet (this is \\(2^{64}\\) addresses).

## Allocating an IPv6 address to a new EC2 instance

Proceed through the configuration wizard like normal, but at `Step 3: Configure Instance Details`, you need to explicitly choose a subnet which has an IPv6 address block. You can then choose to `Auto-assign IPv6 IP`.

## Allocating an IPv6 address to an existing EC2 instance or Elastic network interface

Go to the EC2 console and choose the instance you want to add an IPv6 address to. Right click it and choose `Networking > Manage IP addresses` (or just `Manage IP addresses` for an Elastic network interface), then under `IPv6 Addresses`, choose `Assign new IP`. You can then either auto-assign an address within the right range, or choose one yourself.