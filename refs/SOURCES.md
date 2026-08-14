# Historical glyph sources

The oracle-bone, bronze-inscription, and Shuowen small-seal forms are checked-in
raster exports of SVG transcriptions from Wikimedia Commons' Ancient Chinese Characters project.
The selected file pages cite Academia Sinica's databases, CHANT, the Chinese
University of Hong Kong Multi-function Chinese Character Database, and the
Chinese Text Project. The vector files are marked public domain or CC0 on their
individual Commons description pages.

Historical identification and explanatory copy are checked against CUHK's
Multi-function Chinese Character Database (`漢語多功能字庫`), including its
`形義通解` entries. Ancient characters naturally have multiple attested variants;
the film deliberately uses one documented representative form per period and
does not imply that it was the only contemporary form.

The clerical stage is a clean structural redraw checked against Academia
Sinica's `秦漢魏晉篆隸字形表` database rather than a claim to reproduce one
particular rubbing. Modern forms use the simplified standard character shown in
the title card.

Refresh the offline reference set with:

```sh
node sync-official-glyphs.mjs
node build-glyphs.mjs
```
