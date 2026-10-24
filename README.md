# Kids Mahabharath

Gentle read-aloud bedtime stories from Vyasa's Mahabharata for young children (around age 5). The parent reads the story aloud, the child imagines it, and at the end the parent taps **✨ Reveal the pictures** to show the illustrations one at a time. There is also an optional narrated audio version.

Live site (GitHub Pages): https://skuntla.github.io/Kids-mahabharath/

## Structure
```
index.html              Home page: episode list
.nojekyll               Serve files as-is (no Jekyll)
episodes/
  ep01/  The River Goddess and the Brave Prince
  ep02/  The Great Promise
  ep03/  Big Brother Bhishma
  ep04/  The Three Princesses of Kashi
  ep05/  Amba's Brave Journey
    index.html          Read-aloud page + "Reveal the pictures" slideshow + "Listen instead" audio + prev/next links
    story.md            Story source (~500-650 words); *(pause)* = pause, **bold** = act-it-out words
    episodeN.mp3        Narration (edge-tts en-IN-NeerjaNeural, rate -10%, short silences at pauses, quiet hum)
    img/                ~1024px JPG scene pictures, numbered in slideshow order (5+ per episode)
characters/
  index.html            "Meet the characters" page
  characters.md         Look of each character, which episodes they appear in, which reference sheet to use
  sheet-1-shantanu-ganga-devavrata.jpg
  sheet-2-satyavati-dashraj.jpg
  sheet-3-chitrangada-vichitravirya.jpg
  sheet-4-amba-ambika-ambalika.jpg
  sheet-5-king-of-kashi-shalva.jpg
  sheet-6-parashurama-hotravahana.jpg
games/knight-world/     A small kids' game
```

## Adding an episode
1. Copy `episodes/epNN/` from the latest episode to the next number.
2. Write `story.md`: about 500-650 words (4-5 min read aloud), faithful to the epic and gentle. Start with a two-line "Last time..." recap; end with a lesson, a question and "Goodnight". Mark pauses with `*(pause)*` / `*(long pause)*`.
3. Make at least 5 scene pictures following `characters/characters.md`, always attaching the listed reference sheets. Add new characters there with a new `sheet-N-....jpg`. Compress: `ffmpeg -i in.png -vf "scale='min(1024,iw)':-2" -q:v 4 img/1-name.jpg`.
4. In the episode's `index.html`: update the title, story text, the slideshow list `S` (`[image, title, caption]`, with an optional 4th item listing names for a character-sheet slide), the prev/next links and the episode list. Also add a "Next" link to the previous episode.
5. Record narration: strip markdown, run `edge-tts --voice en-IN-NeerjaNeural --rate=-10%` per pause-separated section, join with 1.2 s / 2.5 s silences, and mix in a quiet low hum with ffmpeg (about 4% volume).
6. Link the episode on the root `index.html` and push to `main`. GitHub Pages redeploys automatically.
