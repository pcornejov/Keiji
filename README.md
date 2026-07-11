# Enciclopedia de Keiji 🐓

Enciclopedia web no oficial de **Keiji**, el gallo protagonista de *Rooster Fighter* (ニワトリ・ファイター, *Niwatori Fighter*) de Shu Sakuratani.

Sitio estático construido con [Astro](https://astro.build) y desplegado en GitHub Pages: <https://pcornejov.github.io/Keiji/>

## Stack

- **Astro** (sitio 100% estático; los datos se resuelven en build time con content collections sobre JSON en `src/data/`).
- **GitHub Actions** (`.github/workflows/deploy.yml`) con la action oficial `withastro/action` para build + deploy a Pages.
- Datos de [AniList](https://anilist.co), [Jikan/MyAnimeList](https://jikan.moe) y la [wiki Fandom de Rooster Fighter](https://roosterfighter.fandom.com). Las imágenes se hotlinkean desde los CDNs de las fuentes; no se rehospeda material con copyright.

## Desarrollo

```sh
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Subagentes

En `.claude/agents/` viven los tres roles usados para construir el sitio con Claude Code: `investigador` (datos desde las APIs), `disenador` (sistema visual) y `desarrollador` (implementación Astro).

## Aviso

Proyecto de fans sin fines de lucro. Todo el material con copyright pertenece a Shu Sakuratani, Shogakukan y sus respectivos dueños.
