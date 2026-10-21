# Kids Mahabharath

Gentle read-aloud bedtime stories from Vyasa's Mahabharata for young children (around age 5). The parent reads the story aloud, the child imagines it, and at the end the parent taps **✨ Reveal the pictures** to show the illustrations one at a time. There is also an optional narrated audio version.

Live site (GitHub Pages): https://skuntla.github.io/Kids-mahabharath/

## Structure
```
index.html            Home page: episode list
.nojekyll             Serve files as-is (no Jekyll)
episodes/
  ep01/
    index.html        Read-aloud page + picture reveal slideshow + "Listen instead" audio
    story.md          Story text (source); *(pause)* marks pauses, **bold** = act-it-out words
    episode1.mp3      Narration (edge-tts en-IN-NeerjaNeural, rate -10%, quiet background hum)
    img/              1024px JPGs: 1-…5-… scene pictures + characters.jpg
characters/
  index.html          "Meet the characters" page
  character-sheet.jpg Reference image
  characters.md       Look of each character + art style, for consistent future pictures
games/knight-world/   A small kids' game
```

## Adding an episode
1. Copy `episodes/ep01/` to `episodes/epNN/`.
2. Write `story.md` (about 800-1000 words, faithful to the epic, gentle; end with a lesson, a question and "Goodnight").
3. Make 5 scene pictures that follow `characters/characters.md` (add new characters there too); save as ~1024px JPGs in `img/`.
4. Update `index.html` in the episode folder: story text, the slideshow list `S` (image, title, caption), and the episode list.
5. Record narration, e.g. `edge-tts --voice en-IN-NeerjaNeural --rate=-10% -f story.txt --write-media episodeNN.mp3` (strip markdown/pause markers first).
6. Link the episode from the root `index.html` (replace a "coming soon" entry) and push to `main`. GitHub Pages redeploys automatically.
