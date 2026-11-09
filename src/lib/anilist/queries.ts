const MEDIA_FRAGMENT = `
  fragment MediaFields on Media {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    format
    status
    seasonYear
    episodes
    averageScore
    genres
    description(asHtml: false)
    nextAiringEpisode {
      episode
      airingAt
      timeUntilAiring
    }
  }
`;

export const TRENDING_ANIME_QUERY = `
  query TrendingAnime($page: Int = 1, $perPage: Int = 20) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const TOP_AIRING_QUERY = `
  query TopAiring($page: Int = 1, $perPage: Int = 20) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: ANIME
        status: RELEASING
        sort: POPULARITY_DESC
        isAdult: false
      ) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const POPULAR_ANIME_QUERY = `
  query PopularAnime($page: Int = 1, $perPage: Int = 20) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const RECENT_EPISODES_QUERY = `
  query RecentEpisodes($now: Int!, $perPage: Int = 20) {
    Page(page: 1, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      airingSchedules(airingAt_lesser: $now, sort: TIME_DESC) {
        airingAt
        episode
        media {
          ...MediaFields
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const SEARCH_ANIME_QUERY = `
  query SearchAnime($search: String!, $page: Int = 1, $perPage: Int = 8) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        search: $search
        type: ANIME
        isAdult: false
        sort: SEARCH_MATCH
      ) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const ANIME_DETAIL_QUERY = `
  query AnimeDetail($id: Int!) {
    Media(id: $id, type: ANIME) {
      ...MediaFields
      duration
      studios(isMain: true) {
        nodes {
          name
        }
      }
      trailer {
        id
        site
        thumbnail
      }
      recommendations(sort: RATING_DESC, perPage: 8) {
        nodes {
          mediaRecommendation {
            ...MediaFields
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

export const BROWSE_ANIME_QUERY = `
  query BrowseAnime(
    $page: Int = 1
    $perPage: Int = 24
    $search: String
    $genre: String
    $season: MediaSeason
    $seasonYear: Int
    $format: MediaFormat
    $status: MediaStatus
    $sort: [MediaSort] = [POPULARITY_DESC]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: ANIME
        isAdult: false
        search: $search
        genre: $genre
        season: $season
        seasonYear: $seasonYear
        format: $format
        status: $status
        sort: $sort
      ) {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;
