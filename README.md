# Instrus

## Mettre à jour le repo SANS modifier la prod:

```sh
git add .
git commit -m "message"
git push
```

## Mettre à jour le repo ET la prod :

```sh
npm run build
git add .
git commit -m "message"
git push
```