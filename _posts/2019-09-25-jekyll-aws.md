---
layout: post
title:  "Deploy Jekyll Static Websites from GitHub to AWS with a Single CloudFormation Template"
date:   2019-09-25 09:00:00 -0400
---
This post explains how to automatically deploy a GitHub-hosted Jekyll static website to AWS with a custom domain name provided by Amazon Route 53.  If you're interested in the underlying architecture, read on, but if you're looking for a quick, on-rails solution, everything discussed below has been codified as an AWS CloudFormation template in an associated GitHub project at [https://github.com/ethanfahy/jekyll-aws](https://github.com/ethanfahy/jekyll-aws).

**_Wait, have you not heard of GitHub/GitLab Pages? Why are we doing this?_**
[GitHub Pages](https://pages.github.com/) and [GitLab Pages](https://about.gitlab.com/product/pages/) both allow you to host free Jekyll-based static websites, and that is indeed the easier solution for most people.  I decided to self-host my personal website, [ethanfahy.cloud](ethanfahy.cloud), on AWS instead of GitHub or GitLab Pages because I had already registered my domain via Amazon Route 53 and found it difficult (impossible?) to configure my Route 53 custom domain with either GitHub Pages or GitLab Pages.  I also decided to self-host on AWS because I wanted to gain more AWS experience with the relevant AWS services used in this solution.  

## Architecture Overview
![jekyll-aws Architecture](/assets/jekyll-aws.png)

The diagram above shows a non-exhaustive overview of the architecture.

The primary goal is to deploy a Jekyll static website on AWS using a custom domain from Route 53.  The simplest way to deploy a static website using AWS is to use the [built-in static website hosting feature of S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).  However, this feature has some downsides, most notably the inability to support https traffic, which is increasingly becoming a non-starter as browsers begin to warn users against any website that does not use https.  To get https support, as well as significantly boost the performance of our website by caching its contents at edge locations around the world, we'll instead use AWS CloudFront and use S3 only as a place to store our static website content as an origin for CloudFront.  

The secondary goal is to set up a CI/CD pipeline to automatically deploy any changes to our GitHub-hosted Jekyll static website to AWS whenever we make changes to our website and push them to GitHub.  AWS CodePipeline has a built-in integration with GitHub that uses a webhook to trigger CodePipeline CI/CD pipelines whenever code is pushed to a GitHub project.  CodePipeline can then orchestrate the build and deployment of the static website using AWS CodeBuild.  

## Implementation via CloudFormation
The solution above is available via a CloudFormation template [here](https://github.com/ethanfahy/jekyll-aws).  AWS CloudFormation is AWS's Infrastructure as Code service that lets you codify your AWS Resources in a JSON or YAML file and provision them in a repeatable and automated fashion.  Have a look at the GitHub repository for more specific information about prerequisites and deployment instructions.  The reason this blog post can be so brief is that all of the technical details required to get the solution working are codified and documented in CloudFormation (hooray!).
