---
draft: false
publish: true
aliases:
  - Steam's API
description: Did you know Steam has a public API? I didn't. Let's check it out.
date: 2024-08-19
updated: 2024-11-23
tags:
  - snippets
  - language/javascript
  - gaming
banner-alt: Steam Logo
banner: https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016
---

## Table of contents

## Prerequisites

First and foremost, here's the docs:

> https://steamcommunity.com/dev

Now that we have that out of the way, there are two things that you need:

1. A [SteamId](#how-do-i-find-my-steamid)
2. A [Steam API Key](#how-do-i-find-my-steam-api-key)

See below for instruction for each of these

### How do I find my SteamId?

Login to Steam on the web or in the desktop app.

Go to the upper-right corner and click on

`[Your Username] -> Account Details`

In the header, under "[Username]'s Account", you'll find your 17 Digit SteamId that looks like this:

`SteamdID: XXXXXXXXXXXXXXXXX`

### How do I find my Steam API Key?

you can visit the [Steam API Key Dashboard](https://steamcommunity.com/dev/apikey) to register a new API key.

Here's the full URL:

https://steamcommunity.com/dev/apikey

## Steam API Reference

 https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29

GetPlayerSummary - http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530

GetOwnedGames - http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json

GetPlayerAchievements - http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197972495328

GetUserStatsForGame - http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197972495328

```ts
export const STEAM_ID = import.meta.env.STEAM_ID ?? process.env.STEAM_ID
export const STEAM_IDS = import.meta.env.STEAM_IDS ?? process.env.STEAM_IDS
export const STEAM_API_KEY =
  import.meta.env.STEAM_API_KEY ?? process.env.STEAM_API_KEY


const BASE_URL = 'https://api.steampowered.com'
const BASE_PATHS = {
  GetPlayerSummaries: '/ISteamUser/GetPlayerSummaries/v0002',
  GetOwnedGames: '/IPlayerService/GetOwnedGames/v0001',
  GetFriendList: '/ISteamUser/GetFriendList/v0001',
  GetNewsForApp: '/ISteamNews/GetNewsForApp/v0002',
  GetPlayerAchievements: '/ISteamUserStats/GetPlayerAchievements/v0001',
  GetUserStatsForGame: '/ISteamUserStats/GetUserStatsForGame/v0002'
}

export interface SteamApiResponse<T> {
  response: T
}

export type GetPlayerSummariesResponse = SteamApiResponse<{
  players: Array<{
    steamid: string
    communityvisibilitystate: number
    profilestate: number
    personaname: string
    profileurl: string
    avatar: string
    avatarmedium: string
    avatarfull: string
    avatarhash: string
    lastlogoff: number
    personastate: number
    realname: string
    primaryclanid: string
    timecreated: number
    personastateflags: number
    gameextrainfo: string
    gameid: string
  }>
}>

export type GetOwnedGamesResponse = SteamApiResponse<{
  games_count: number
  games: Array<
    {
      appid: number
      playtime_forever: number
      playtime_windows_forever: number
      playtime_mac_forever: number
      playtime_linux_forever: number
      playtime_deck_forever: number
      rtime_last_played: number
      playtime_disconnected: number

      // when include_appinfo is true
      name: string
      has_community_visibile_stats: true
      content_descriptorids: Array<number>
      img_icon_url: string
    } & (
      | { enhanced?: false }
      | {
          enhanced: true

          achievements: GetPlayerAchievementsResponse['playerstats']['achievements']
          achievementsCountTotal: number
          achievementsCountAchieved: number
          achievementsCountPercent: string

          stats: GetUserStatsResponse['playerstats']['stats']
          statsCount: number

          news: GetNewsForAppResponse['appnews']['newsitems']
          newsCount: number
        }
    )
  >
}>

export type GetPlayerAchievementsResponse = {
  playerstats: {
    success: boolean
    steamID: string
    gameName: string
    achievements: Array<{
      apiname: string
      achieved: number // 0 or 1
      unlocktime: number
    }>
  }
}

export type GetUserStatsResponse = {
  playerstats: {
    success: boolean
    steamID: string
    gameName: string
    stats: Array<{
      name: string
      value: number
    }>
  }
}

export type GetFriendsListResponse = Array<{
  steamid: string
  relationiship: string
  friends_since: number
}>

export type GetNewsForAppResponse = {
  appnews: {
    appid: number
    count: number
    newsitems: Array<{
      gid: string
      appid: number
      title: string
      url: string
      is_external_url: boolean
      author: string
      contents: string
      feedlabel: string
      date: number
      feed_type: number
    }>
  }
}

interface SteamAPI {
  GetPlayerSummaries: (
    steamIds: Array<string>
  ) => Promise<GetPlayerSummariesResponse>
  GetPlayerAchievements: (
    steamId: string,
    appId: number
  ) => Promise<GetPlayerAchievementsResponse>
  GetUserStatsForGame: (
    steamId: string,
    appId: number
  ) => Promise<GetUserStatsResponse>
  GetOwnedGames: (steamId: string) => Promise<GetOwnedGamesResponse>
  GetFriendList: (
    steamId: string,
    relationship?: 'all' | 'friend'
  ) => Promise<GetFriendsListResponse>
  GetNewsForApp: (
    appId: number,
    count?: number,
    maxlength?: number
  ) => Promise<GetNewsForAppResponse>
}

export function makeSteamAPI(
  baseUrl: string = BASE_URL,
  apiKey: string = STEAM_API_KEY
): SteamAPI {
  let authUrl: URL = new URL(baseUrl)
  authUrl.searchParams.set('key', apiKey)

  const self: SteamAPI = {
    GetPlayerSummaries: async (steamIds) => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetPlayerSummaries
      url.searchParams.set('steamids', steamIds.join(','))
      url.searchParams.set('format', 'json')

      return handleFetch<GetPlayerSummariesResponse>(url.href).catch(
        (reason) => {
          console.error(
            '[Steam] :: Failed to fetch player summaries ::',
            reason
          )
          return { response: { players: [] } }
        }
      )
    },

    GetOwnedGames: async (steamId) => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetOwnedGames
      url.searchParams.set('steamid', steamId)
      url.searchParams.set('include_appinfo', 'true')
      url.searchParams.set('include_played_free_games', 'true')
      url.searchParams.set('format', 'json')

      return handleFetch<GetOwnedGamesResponse>(url.href).catch((reason) => {
        console.error('[Steam] :: Failed to fetch owned games ::', reason)
        return { response: { games: [], games_count: 0 } }
      })
    },

    GetNewsForApp: async (appId, count = 5, maxlength = 1000) => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetNewsForApp
      url.searchParams.set('appid', appId.toString())
      url.searchParams.set('count', count.toString())
      url.searchParams.set('maxlength', maxlength.toString())
      url.searchParams.set('format', 'json')

      return handleFetch<GetNewsForAppResponse>(url.href).catch((reason) => {
        console.error('[Steam] :: Failed to fetch news ::', reason)
        return { appnews: { count: 0, newsitems: [], appid: appId } }
      })
    },

    GetFriendList: async (steamId, relationship = 'friend') => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetFriendList
      url.searchParams.set('steamid', steamId)
      url.searchParams.set('relationship', relationship)
      url.searchParams.set('format', 'json')

      return handleFetch<GetFriendsListResponse>(url.href).catch((reason) => {
        console.error('[Steam] :: Failed to fetch friend list ::', reason)
        return []
      })
    },

    GetPlayerAchievements: async (steamId, appId) => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetPlayerAchievements
      url.searchParams.set('appid', appId.toString())
      url.searchParams.set('steamid', steamId)

      return handleFetch<GetPlayerAchievementsResponse>(url.href).catch(
        (reason) => {
          console.error(
            '[Steam] :: Failed to fetch player achievements ::',
            reason
          )
          return {
            playerstats: {
              achievements: [],
              gameName: 'N/A',
              steamID: 'N/A',
              success: false
            }
          }
        }
      )
    },

    GetUserStatsForGame: async (steamId, appId) => {
      const url = new URL(authUrl)
      url.pathname = BASE_PATHS.GetUserStatsForGame
      url.searchParams.set('appId', appId.toString())
      url.searchParams.set('steamid', steamId)

      return handleFetch<GetUserStatsResponse>(url.href).catch((reason) => {
        console.error('[Steam] :: Failed to fetch player stats ::', reason)
        return {
          playerstats: {
            gameName: 'N/A',
            stats: [],
            success: false,
            steamID: 'N/A'
          }
        }
      })
    }
  }

  return self
}

async function enhanceGame(
  steamId: string,
  game: GetOwnedGamesResponse['response']['games'][number],
  srv: { steam: SteamAPI }
) {
  const { steam } = srv
}

export async function getProfilesFromSteamIds(
  steamIds: Array<string>,
  srv: { steam: SteamAPI }
) {
  const { steam } = srv

  const playerSummariesResponse = await steam.GetPlayerSummaries(steamIds),
    playerSummaries = playerSummariesResponse.response.players

  const getProfileGames = async (
    profile: GetPlayerSummariesResponse['response']['players'][number]
  ) => {
    const ownedGamesResponse = await steam.GetOwnedGames(
        profile?.steamid ?? ''
      ),
      ownedGames = ownedGamesResponse.response.games

    ownedGames.sort((a, b) =>
      a.playtime_forever < b.playtime_forever ? 1 : -1
    ) // sortbyplaytime

    // ownedGames.sort((a, b) =>
    //   a.rtime_last_played < b.rtime_last_played ? 1 : -1
    // ) // sortbylastplayed

    const enhancementLimit = import.meta.env.PROD ? 25 : 5 // limit the number of games to enhance, useful for larger libraries
    const enhancedGamesPromises = ownedGames
      .slice(0, enhancementLimit >= 0 ? enhancementLimit : undefined)
      .map(
        async (game) => {
          if (!profile) {
            return Promise.resolve(game)
          }

          const steamId = profile.steamid,
            appId = game.appid

          const statResults = await steam.GetUserStatsForGame(steamId, appId)
          const aResults = await steam.GetPlayerAchievements(steamId, appId)
          const stats = statResults.playerstats.stats
          const statsCount = stats.length

          const achievements = aResults.playerstats.achievements
          achievements.sort((a, b) => (a.unlocktime < b.unlocktime ? 1 : -1))

          const totalCount = achievements.length
          const achievedCount = achievements.filter(
            (a) => a.achieved != 0
          ).length
          const achievedPercentNum = (achievedCount / totalCount) * 100
          const achievedPercent = isNaN(achievedPercentNum)
            ? '0'
            : achievedPercentNum.toFixed(2)

          const newsResults = await steam.GetNewsForApp(appId)
          const news = newsResults['appnews']['newsitems']
          const newsCount = news.length

          return {
            ...game,
            enhanced: true,

            stats: stats,
            statsCount: statsCount,

            news: news,
            newsCount,

            achievements: achievements,
            achievementsCountTotal: totalCount,
            achievementsCountAchieved: achievedCount,
            achievementsCountPercent: achievedPercent
          }
        }
        // profile ? enhanceGame(profile.steamid, g, srv) : Promise.resolve(g)
      )

    const enhancedGames = await Promise.allSettled(enhancedGamesPromises).then(
      (results) =>
        results.filter((g) => g.status === 'fulfilled').map((g) => g.value)
    )

    return {
      profile,
      games: [
        ...enhancedGames,
        ...ownedGames.slice(
          enhancementLimit >= 0 ? enhancementLimit : undefined
        )
      ]
    }
  }

  const steamProfilePromises = playerSummaries.map(getProfileGames),
    steamProfiles = await Promise.allSettled(steamProfilePromises).then(
      (results) =>
        results.filter((g) => g.status === 'fulfilled').map((g) => g.value)
    )

  return steamProfiles
}

export function printUnixDate(t: unknown): string {
  if (t && typeof t === 'number' && t > 0) {
    const date = new Date(t * 1000)
    return date.toLocaleDateString()
  }

  return 'N/A'
}

async function handleFetch<T = unknown>(url: string): Promise<T> {
  console.debug(`[Steam] :: Fetching ${url.split('?')[0]}...`)

  const response = await fetch(url, { cache: 'default' })

  if (!response.ok || response.status < 200 || response.status > 299) {
    throw new Error('Failed to load data.')
  }

  const data = (await response.json()) as T
  return data
}
```
