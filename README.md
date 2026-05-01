# Our Story 💕

A choose-your-own-adventure love story birthday gift. Built with vanilla HTML/CSS/JS and JSON-driven content.

## Startup

### Normal Mode

```bash
cd /Users/C383272/birthday
python3 -m http.server 8080
```

Open: http://localhost:8080

### Debug Mode

Skips typewriter animation (30ms/char) and fade transitions (400ms). Useful for testing scene flow quickly.

```bash
# Same server, just add ?debug to the URL
open http://localhost:8080/?debug
```

### Direct Scene Access

Jump to any scene via URL hash:

```
http://localhost:8080/#arab_guy_habibi
http://localhost:8080/?debug#wedding_blonde
http://localhost:8080/?story=dorito#the_squish
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | HTML shell + all CSS (cover page, story container, animations) |
| `app.js` | Story engine (scene rendering, routing, music switching, cover logic) |
| `story.json` | Main story content (38 scenes) |
| `story_dori.json` | Dorito's POV story (8 scenes) |
| `music.mp3` | Background music (replace with Taylor Swift) |
| `arab_music.mp3` | Arab guy path music (replace with Shik Shak Shok) |

## Features

- Cover page with two story paths (Main / Dorito POV)
- URL hash routing (bookmarkable, browser back/forward)
- Back button (←) with scene history
- Music toggle with automatic track switching (arab scenes)
- Typewriter text effect with debug skip
- Celebration animations (hearts + confetti) on finales
- Post-credits scene accessible from main finale
- Dark mode text for cinematic scenes
- OG meta tags for link previews

## State Transition Diagram

### Main Story (`story.json`)

```
                            ┌─────────────────────────────────────────────────┐
                            │                  COVER PAGE                      │
                            │         [Play Our Story] [Play as Dorito]        │
                            └──────────────────────┬──────────────────────────┘
                                                   │
                                                   ▼
                         ┌──────── start ◄──── cat_lady (loop back)
                         │            │
                         │            ├──────► start_loop ───┐
                         │            │                      │
                         │            ▼                      │
                         │       first_chat ◄───────────────┘
                         │         │       │
                         │         │       └──────────────────────► invite_him_over ★
                         │         ▼
                         │       memes
                         │         │
                         │         ▼
                         │     memes_loop
                         │         │
                         │         ▼
                         │    memes_loop_2
                         │         │
                         │         ▼
                         │    memes_loop_3
                         │         │       │
                         │         │       └──► meme_to_mom ──► meme_to_mom_2 ──► married_2 ★
                         │         │
                         │         ▼
                         │     first_meet
                         │       │       │
                         │       │       └──► pacific_centre ──► pacific_centre_2 ──► pacific_centre_3
                         │       │                                                         │
                         │       ▼                                                         │
                         │   coal_harbour ◄────────────────────────────────────────────────┘
                         │     │       │
                         │     │       └──► tattoo_idea ──► tattoo_result ──┐
                         │     │                                            │
                         │     ▼                                            │
                         │   official ◄────────────────────────────────────┘
                         │     │       │
                         │     │       └──► we_need_to_talk ──┐
                         │     │                              │
                         │     ▼                              │
                         │  dates_montage ◄───────────────────┘
                         │     │         │
                         │     │         └──► cooking_disaster ──► cooking_disaster_2 ──┐
                         │     │                                                        │
                         │     ▼                                                        │
                         │  fight_night ◄──────────────────────────────────────────────┘
                         │     │       │
                         │     │       └──► makeout_5am ──┐
                         │     │                          │
                         │     ▼                          │
                         │  makeup_2am                    │
                         │     │                          │
                         │     ▼                          │
                         │  engaged ◄─────────────────────┘
                         │     │       │
                         │     │       └──► arab_guy ──┬──► arab_guy_2nd_wife (loops to first_chat)
                         │     │                       ├──► arab_guy_cats (loops to first_chat)
                         │     │                       └──► arab_guy_habibi
                         │     │                                   │
                         │     │                                   ▼
                         │     │                            arab_guy_dream ★
                         │     ▼
                         │  married
                         │     │       │
                         │     │       └──► wedding_objection
                         │     │               │       │
                         │     │               │       └──► wedding_blonde ★
                         │     │               │
                         │     │               ▼
                         │     │           (back to finale)
                         │     ▼
                         │   finale ★ ──── [Post-credits 🎬] ──► post_credits ★
                         │
                         └─── (★ = finale scene with celebration)

```

### Dorito's Story (`story_dori.json`)

```
  start ──► start_knock ──┐
    │                      │
    └──────────────────────┼──► new_human
                           │        │
                           │        ▼
                           │    he_visits
                           │        │
                           │        ▼
                           │   the_squish
                           │        │
                           │        ▼
                           │   competition
                           │        │
                           │        ▼
                           │    wedding
                           │        │
                           │        ▼
                           │  finale_dori ★
```

### Music State Machine

```
  ┌─────────────┐                          ┌─────────────┐
  │  music.mp3  │ ── enter arab_guy* ──►   │arab_music.mp3│
  │  (default)  │ ◄── leave arab_guy* ──   │   (arab)    │
  └─────────────┘                          └─────────────┘
        │                                         │
        └──── restart (cover page) ◄──────────────┘
```

Arab scenes: `arab_guy`, `arab_guy_2nd_wife`, `arab_guy_cats`, `arab_guy_habibi`, `arab_guy_dream`

## Replacing Placeholder Audio

The `.mp3` files are procedurally generated placeholders. To use real songs:

1. Replace `music.mp3` with your desired track (e.g., Taylor Swift - Enchanted)
2. Replace `arab_music.mp3` with your desired track (e.g., Hassan Abou El Seoud - Shik Shak Shok)

Both must be named exactly as above. The browser handles looping automatically.
