---
draft: 
publish: true
aliases: []
date: 2022-06-06
updated: 2025-02-09
tags:
  - tools/serverless-functions
  - tools/nextjs
  - tools/firebase
  - projects/archive
url: https://shrtme.app
git: https://github.com/kuhree/shrt.git
up: 
jump: 
down: 
id: shrtme
---

## Shrt (Alpha)

 Your Main Link, Forever.

### Summary

ShrtMe is a product that allows marketers and influencers to connect all of their accounts in one place. Create a PLP, add your links, and begin connecting your audience to your content around the world.

### Introduction

ShrtMe began as a need for a personal URL shortner. I didn't want to use [bit.ly](http://bit.ly) or any of the other services. Out of this, came the need to create PLP to display a user's `shrts` to the public.

### Goals and Requirements

Given the context, we wanted the following features.

- [x] User authentication and authorization
- [x] URL shrts
- [x] Personal Landing Page

### Implementation

To build ShrtMe, we ended up using the following technologies; React.JS, Next.JS, Vercel, GCP, Node, Emotion, Jest, and SweetAlert2. We also used the Firestore, Authentication, Cloud Functions, and Storage SDKs from Firebase.

This stack came with a lot of features that we need to fulfill the above requirements.

On the backend, Firestore allowed us to have a real-time updates to the client-side of the app using web sockets. We used Cloud Functions to monitor changes in the db and validate the changes.

React and Next.JS helped us with building out the frontend of the site. We used Next.JS's api routes and `getServerSideProps` to create the redirect for the url-shortner.

The app itself is hosted on Vercel which handles our CD and page analytics.

### Current Status

Shrt is currently preparing for a beta launch in January of 2021.

### Lessons Learned

- MVP's are better than non-finished projects
- Make it Work → Build it Right → Make it Fast
- Market before/while you build to gauge interest, features, and build awareness
