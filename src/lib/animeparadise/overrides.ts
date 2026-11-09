/**
 * Known AniList ID -> AnimeParadise ID mappings.
 *
 * Most anime can be resolved by title + year, but some titles are ambiguous
 * (different season labels, alternate translations, movies sharing a name).
 * Add an entry here when the automatic matcher picks the wrong series or
 * cannot find one at all.
 */
export const animeParadiseOverrides: Record<number, string> = {
  // Naruto (2002)
  20: "OGCLrfH4Gdr4yGZg",
  // One Piece (1999)
  21: "ASa7g4dGZREXdtzA",
  // Attack on Titan (2013) / Season 2 (2017)
  16498: "1eo7qphaV6XBgerx",
  20958: "d9FieOUgc99q49sM",
  // Black Clover (2017)
  97940: "qBc2O7jBL03Egce7",
  // Solo Leveling (2024) / Season 2 (2025)
  151807: "Y45v9Oh6TpXU1EEY",
  176496: "67003839e9aec61796753c7b",
  // Frieren: Beyond Journey's End (2023)
  154587: "NIUsb960SxtXls4h",
};
