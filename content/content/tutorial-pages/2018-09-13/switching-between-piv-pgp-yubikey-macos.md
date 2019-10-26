---
title: "Switching between YubiKey's PIV and PGP applets on macOS"
authors:
    - "Aapeli Vuorinen"
date: "2018-09-13"
tags:
    - security
    - yubikey
    - gpg
    - pgp
    - piv
    - privacy
    - encryption
    - x509
    - cryptography
    - digital-signatures
    - elliptic-curve-cryptography
contentType: "tutorial"
callToActionText: "Are you interested in ultimate security for your company? Could hardware security devices improve your internal processes and security policies? Fill in the form below to have one of our knowledgeable security experts contact you."
hideCallToAction: false
---

Quick tip on using the PIV and PGP applets simultaneously on a YubiKey on macOS.

<!-- end excerpt -->

We use [YubiKeys](https://www.yubico.com/) for a variety of purposes, and as this involves using different functionality, we often have to switch between the PGP and PIV applets.

[PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy), or "Pretty Good Privacy", is a format for encrypted messages, cryptographic signatures and keys. Initially developed in 1991 by [Phil Zimmermann](https://en.wikipedia.org/wiki/Phil_Zimmermann), it was later standardised in [RFC4880](https://tools.ietf.org/html/rfc4880) as the [OpenPGP](https://www.openpgp.org/) format. We use PGP to sign [git](https://git-scm.com) commits, for encrypted email, for code and release signing, and so on. The PGP trust model is based on a web of trust.

[PIV](https://en.wikipedia.org/wiki/FIPS_201), which stands for "Personal Identity Verification" is another format, originally created to authenticate United States federal employees and contractors. It's based on [X.509](https://en.wikipedia.org/wiki/X.509) certificates and is commonly interfaced with through smart cards, with the latest standard being [FIPS 201-2](https://csrc.nist.gov/publications/detail/fips/201/2/final). We use the PIV applet for client-side TLS authentication to some security-critical sites, as well as for our internal [X.509](https://en.wikipedia.org/wiki/X.509) [public key infrastructure](https://en.wikipedia.org/wiki/Public-key_infrastructure).

However, after starting to use the YubiKey with [OpenSC](https://github.com/OpenSC/OpenSC), we quickly found out that there's a few issues with it unless you set it up right.

After a bit of digging around, we found a fix for this issue.

## Installation

Make sure you have installed and are using GPG from [GPG Suite](https://gpgtools.org/). They have integrated a patch that allows GnuPG to share access to the YubiKey, not locking it up.

Now add the line `shared-access` to `~/.gnupg/scdaemon.conf`, for instance by running:

```
echo "shared-access" >> ~/.gnupg/scdaemon.conf
```

## Switching between the PIV and PGP applets

Now to switch between the applets, just use either of the two commands:

```
# To use PIV
yubico-piv-tool -astatus
# To use PGP
gpg --card-status
```

## Why this works

The upstream version of GPG does not allow sharing the security device, and holds a lock on it. This was reported to the GPGTools team [here](https://gpgtools.tenderapp.com/discussions/problems/50028-macgpg2-scdaemon-pcsc-open-failed-sharing-violation-0x8010000b), and they patched it to add the configuration flag as explaiend [here](https://gpgtools.tenderapp.com/discussions/problems/50028-macgpg2-scdaemon-pcsc-open-failed-sharing-violation-0x8010000b/page/1#comment_42960303).

See also [this](https://github.com/OpenSC/OpenSC/issues/953) discussion on the OpenSC issue tracker.
