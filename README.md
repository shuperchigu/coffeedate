# Paemani

პატარა Netlify-ready React საიტი ყავის პაემნის მოსაწვევად.

## გაშვება ლოკალურად

```bash
npm install
npm run dev
```

## Netlify-ზე დადება

1. ატვირთე repo GitHub-ზე.
2. Netlify-ში შექმენი ახალი site და მიუთითე ეს repo.
3. Build command: `npm run build`
4. Publish directory: `dist`

## მეილზე შეტყობინება

საიტი აგზავნის არჩევანს Netlify Form-ში სახელით `coffee-date`.

Netlify dashboard-ში გახსენი:

`Site configuration -> Forms -> Form notifications -> Add notification -> Email notification`

აირჩიე form `coffee-date` და მიუთითე შენი email. ამის შემდეგ, როცა თათია თარიღს და საათს დაადასტურებს, მეილზეც მოგივა და Netlify Forms-შიც შეინახება.
