var presence = new Presence({
  clientId: "689724677274337290",
});

let timeElapsed = Math.floor(Date.now() / 1000),
  strings = presence.getStrings({
    live: "presence.playback.live",
  }),
  songName,
  albumName,
  artistName;

presence.on("UpdateData", async () => {
  songName = document.querySelector(
    "span#cardTitle.card-title.playerText.truncate"
  );
  albumName = document.querySelector("p#cardAlbum.playerText.truncate");
  artistName = document.querySelector("p#cardArtist.playerText.truncate");
  if (albumName.innerText == "Press the Play button to start the radio") {
    let presenceData: presenceData = {
      details: "Not tuned in.",
      largeImageKey: "clouds",
      smallImageKey: "pause",
    };
    presence.setActivity(presenceData);
  } else {
    let presenceData: presenceData = {
      details: songName.innerText,
      state: artistName.innerText + " - " + albumName.innerText,
      largeImageKey: "clouds",
      smallImageKey: "live",
      startTimestamp: timeElapsed,
    };
    presence.setActivity(presenceData);
  }
});
