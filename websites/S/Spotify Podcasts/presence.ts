const presence = new Presence({
    clientId: "619561001234464789",
    injectOnComplete: true
  }),
  browsingStamp = Math.floor(Date.now() / 1000);

let title: string,
  uploader: string,
  search: HTMLInputElement,
  recentlyCleared = 0;

async function getStrings() {
  return presence.getStrings(
    {
      play: "general.playing",
      pause: "general.paused",
      featured: "spotify.featured",
      bestPodcasts: "spotify.bestPodcasts",
      charts: "spotify.charts",
      genres: "spotify.genres",
      latest: "spotify.latest",
      discover: "spotify.discover",
      browse: "spotify.browse",
      podcastLike: "spotify.podcastsLike",
      artistLike: "spotify.artistsLike",
      albumLike: "spotify.albumLike",
      songLike: "spotify.songsLike",
      forMeh: "spotify.madeForYou",
      playlist: "spotify.playlists",
      viewPlaylist: "general.viewPlaylist",
      download: "spotify.download",
      viewing: "general.viewing",
      account: "general.viewAccount",
      search: "general.search",
      searchFor: "general.searchFor",
      searchSomething: "general.searchSomething",
      browsing: "general.browsing",
      listening: "general.listeningMusic",
      show: "general.viewShow"
    },
    await presence.getSetting("lang").catch(() => "en")
  );
}

let strings: Awaited<ReturnType<typeof getStrings>> = null,
  oldLang: string = null;

presence.on("UpdateData", async () => {
  //* Update strings if user selected another language.
  const [newLang, privacy, timestamps, cover] = await Promise.all([
    presence.getSetting("lang"),
    presence.getSetting("privacy"),
    presence.getSetting("timestamps"),
    presence.getSetting("cover")
  ]);

  if (oldLang !== newLang) {
    oldLang = newLang;
    strings = await getStrings();
  }

  const presenceData: PresenceData = {
      largeImageKey: "spotify"
    },
    albumCover =
      Array.from(document.querySelectorAll("a")).find(
        (a) => a.dataset?.testid === "cover-art-link"
      ) ||
      Array.from(document.querySelectorAll("a")).find(
        (a) => a.dataset?.testid === "context-link"
      );

  let podcast = false,
    searching = false;

  if (
    albumCover !== null &&
    (albumCover.href.includes("/show/") ||
      albumCover.href.includes("/episode/"))
  )
    podcast = true;

  if (!podcast) {
    if (timestamps) presenceData.startTimestamp = browsingStamp;
    presenceData.smallImageKey = "reading";
    if (document.location.hostname === "open.spotify.com") {
      if (document.location.pathname.includes("browse/featured")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.featured;
      } else if (document.location.pathname.includes("browse/podcasts")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.bestPodcasts;
      } else if (document.location.pathname.includes("browse/charts"))
        presenceData.details = strings.charts;
      else if (document.location.pathname.includes("browse/genres"))
        presenceData.details = strings.genres;
      else if (document.location.pathname.includes("browse/newreleases"))
        presenceData.details = strings.latest;
      else if (document.location.pathname.includes("browse/discover"))
        presenceData.details = strings.discover;
      else if (document.location.pathname.includes("/search/")) {
        search = document.querySelector("input");
        searching = true;
        presenceData.details = strings.searchFor;
        presenceData.state = search.value;
        if (search.value.length <= 3) presenceData.state = "something...";

        presenceData.smallImageKey = "search";
      } else if (document.location.pathname.includes("/search")) {
        searching = true;
        presenceData.details = strings.search;
        presenceData.smallImageKey = "search";
      } else if (document.location.pathname.includes("collection/playlists")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.playlist;
      } else if (
        document.location.pathname.includes("collection/made-for-you")
      ) {
        presenceData.details = strings.browse;
        presenceData.state = strings.forMeh;
      } else if (document.location.pathname.includes("collection/tracks")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.songLike;
      } else if (document.location.pathname.includes("collection/albums")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.albumLike;
      } else if (document.location.pathname.includes("collection/artists")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.artistLike;
      } else if (document.location.pathname.includes("collection/podcasts")) {
        presenceData.details = strings.browse;
        presenceData.state = strings.podcastLike;
      } else if (document.location.pathname.includes("/playlist/")) {
        title = document.querySelector(
          "div.main-view-container__scroll-node-child > section > div > div > span > button > h1"
        ).textContent;
        presenceData.details = strings.viewPlaylist;
        presenceData.state = title;
        delete presenceData.smallImageKey;
      } else if (document.location.pathname.includes("/show/")) {
        title = document.querySelector(
          "div.main-view-container__scroll-node-child > section > div > div > h1"
        ).textContent;
        presenceData.details = strings.show;
        presenceData.state = title;
        delete presenceData.smallImageKey;
      } else if (document.location.pathname.includes("/settings")) {
        presenceData.details = strings.account;
        delete presenceData.smallImageKey;
      }
    } else if (document.location.hostname === "support.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Support Center";
    } else if (document.location.hostname === "investors.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Support Center";
    } else if (document.location.hostname === "developer.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Spotify for Developers";
    } else if (document.location.hostname === "artists.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Spotify for Artists";
    } else if (document.location.hostname === "newsroom.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Spotify for Newsroom";
    } else if (document.location.hostname === "podcasters.spotify.com") {
      presenceData.details = strings.browse;
      presenceData.state = "Spotify for Podcasters";
    } else if (document.location.hostname === "www.spotify.com") {
      if (document.location.pathname.includes("/premium")) {
        presenceData.details = strings.viewing;
        presenceData.state = "Spotify Premium";
        delete presenceData.smallImageKey;
      } else if (document.location.pathname.includes("/download")) {
        presenceData.details = strings.download;
        presenceData.smallImageKey = "downloading";
      } else if (document.location.pathname.includes("/account")) {
        presenceData.details = strings.account;
        delete presenceData.smallImageKey;
      }
    }
    const control = document.querySelector(
      "div.player-controls__buttons > button:nth-child(3)"
    ) as HTMLButtonElement;
    if (
      document.querySelector(".now-playing-bar-hidden") !== null ||
      control === null ||
      control.dataset.testid === "control-button-play"
    ) {
      if (!presenceData.details) {
        presence.setTrayTitle();
        presence.setActivity();
      } else {
        if (privacy) {
          if (searching) {
            presenceData.details = strings.searchSomething;
            delete presenceData.state;
          } else {
            presenceData.details = strings.browsing;
            delete presenceData.state;
            delete presenceData.smallImageKey;
          }
          presence.setActivity(presenceData);
        } else presence.setActivity(presenceData);
      }
    } else {
      if (recentlyCleared < Date.now() - 1000) presence.clearActivity();

      recentlyCleared = Date.now();
    }
  } else {
    const currentTime = presence.timestampFromFormat(
        document.querySelector(".playback-bar").children[0].textContent
      ),
      duration = presence.timestampFromFormat(
        document.querySelector(".playback-bar").children[2].textContent
      ),
      [, endTimestamp] = presence.getTimestamps(currentTime, duration);

    let pause: boolean;

    if (
      (
        document.querySelector("div.player-controls__buttons")
          .children[1] as HTMLButtonElement
      ).dataset.testid === "control-button-play"
    )
      pause = true;
    else pause = false;

    presenceData.smallImageKey = pause ? "pause" : "play";
    presenceData.smallImageText = pause ? strings.pause : strings.play;
    presenceData.endTimestamp = endTimestamp;

    if (pause || !timestamps) {
      delete presenceData.startTimestamp;
      delete presenceData.endTimestamp;
    }

    if (cover) presenceData.largeImageKey = albumCover.querySelector("img").src;

    title =
      Array.from(document.querySelectorAll("a")).find(
        (a) => a.dataset?.testid === "nowplaying-track-link"
      )?.textContent ||
      Array.from(document.querySelectorAll("a")).find(
        (a) => a.dataset?.testid === "context-item-link"
      )?.textContent;
    uploader =
      Array.from(document.querySelectorAll("div")).find(
        (a) => a.dataset?.testid === "track-info-artists"
      )?.textContent ||
      Array.from(document.querySelectorAll("a")).find(
        (a) => a.dataset?.testid === "context-item-info-show"
      )?.textContent;
    presenceData.details = title;
    presenceData.state = uploader;

    if (privacy) {
      presenceData.details = strings.listening;
      delete presenceData.state;
    }

    if (title !== null && uploader !== null) presence.setActivity(presenceData);
    else presence.error("Error while getting podcast name and title");
  }
});
