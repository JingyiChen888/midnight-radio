# Process — Midnight Radio

## Starting idea

The first idea was a small mystery played through a radio dial. The intended player is someone who likes short story puzzles. They should move the dial, notice the signal change, listen to three fragments, and use those fragments to answer one question. Three stations and one ending keep the project small enough to finish and test.

## Design and code decisions

The key loop is **tune → see signal feedback → listen → record a clue → tune again**. The final question gives the collected clues a purpose. The code in `app.js` keeps a set of found station frequencies, so a repeated click cannot inflate the clue count. The `signalAt` function separates faint, growing, and clear signals; only a clear signal can be recorded. Listening when there is no clear station gives a specific next step instead of failing silently.

An early title suggestion was *Clues in the Static*. In Chinese, “static” translated awkwardly as “静电,” which suggested an electric shock instead of radio noise. The title was changed to *Midnight Radio* to make the interaction immediately understandable.

The first implementation uses text transcripts rather than audio. This is a deliberate choice: the story remains understandable without headphones, sound permissions, or media files. The radio look is drawn with CSS, so there are no borrowed visual assets to load.

## My own checks

I served the page locally and used a headless Chrome browser to check the main flow: three clear stations, three recorded clues, the unlocked question, a wrong answer, the correct ending, and reset. I also checked two mistakes: listening with no signal and listening to the same station twice. Both give feedback and leave the game state valid. A 390-pixel mobile viewport had no horizontal overflow. These checks do **not** replace the required trial with another person.

## Trial with another person — to complete before submission

This section must be filled in after a real person tries the game. Do not submit it as if the trial has already happened.

- **When and how they tried it:** _Add the date and context; do not identify the person._
- **What they attempted:** _Describe the first actions they took without coaching._
- **Where they hesitated or made a mistake:** _Record an actual observation._
- **Whether the feedback made sense to them:** _Summarize what they said or did._
- **Change made because of the trial:** _Describe one specific edit, or explain why the design was kept._
- **How the change was checked:** _Try the affected interaction again._

## AI tools and authorship

OpenAI ChatGPT/Codex was used to brainstorm feasible assignment ideas, plan the interaction, draft the story and interface, write the initial HTML/CSS/JavaScript, and prepare the documentation. I kept the suggestion to use only three stations, because it creates a complete loop without unnecessary features. I changed the suggested title after noticing the translation problem described above. The work should be reviewed and explained by the student before submission, especially the relationship between `signalAt`, `listen`, and the visible feedback.

## Credits and history

No code, data, images, sound, or fonts were borrowed from an external source or a course example. The commit history is kept in stages to show the initial interaction, documentation, and later changes after testing.
