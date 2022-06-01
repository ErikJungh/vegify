# Information om REST API
## Hämta information om en specifik produkt med GTIN
### Hämta nödvändig information om produkt
`http://vegify-2.platform-spanning.systems:3000/product/{gtin}`

Exempel:
get-request `http://vegify-2.platform-spanning.systems:3000/product/02002059100005`

### Hämta all information om produkt
`http://vegify-2.platform-spanning.systems:3000/product/{gtin}/full`

Exempel:
get-request `http://vegify-2.platform-spanning.systems:3000/product/02002059100005/full`

## Sök efter produkter med en sträng
`http://vegify-2.platform-spanning.systems:3000/product/{string}`

Exempel:
get-request `http://vegify-2.platform-spanning.systems:3000/product/korv`

## Hämta alla recept från databasen
`http://vegify-2.platform-spanning.systems:3000/recipes`

Exempel: get-request `http://vegify-2.platform-spanning.systems:3000/product/korv`

## Ladda upp ett recept
`http://vegify-2.platform-spanning.systems:3000/recipes`

Exempel:
post-request `http://vegify-2.platform-spanning.systems:3000/recipes` med body {
    name: "korv",
    description: "En mycket god korv",
    ingredients: ["korv"],
    steps: ["stek kort"],
    tags: {
        "Nötter":false,
        "Ägg":false,
        "element":false,
        "Soja":false,
        "Sesamfrö":false,
        "Senap":false,
        "Laktos":false,
        "Kräftdjur":false,
        "Jordnötter":false,
        "Fisk":false,
        "Blötdjur":false,
        "Gluten":false,
        "Vegetarian":true,
        "Vegan":true,
        "Svaveldioxid":false},
    portions: 4
}

## Rösta på ett recept
`http://vegify-2.platform-spanning.systems:3000/recipes/{id}?point=5`

Exempel: post-request `http://vegify-2.platform-spanning.systems:3000/recipes/6213b352b4bae1c6418c3ba8?point=5`

## Hämta recept från id
`http://vegify-2.platform-spanning.systems:3000/recipes/{id}`

Exempel: get-request `http://vegify-2.platform-spanning.systems:3000/recipes/6213b352b4bae1c6418c3ba8`

## Sök efter recept
`http://vegify-2.platform-spanning.systems:3000/recipes/search/{string}?tags={}`

Exempel: get-request `http://vegify-2.platform-spanning.systems:3000/recipes/korv?tags={}`

## Lägg till ny produkt i databas
`http://vegify-2.platform-spanning.systems:3000/product`

Exempel: post-request `http://vegify-2.platform-spanning.systems:3000/product` med body {
    GTIN: "02002059100005",
    brand: "Dennis",
    ingredients: "Ägg,Mjöl"
    name: "Korv",
    packagesize: "400",
    image: "url",
    allergens: {
        "Nötter":false,
        "Ägg":false,
        "element":false,
        "Soja":false,
        "Sesamfrö":false,
        "Senap":false,
        "Laktos":false,
        "Kräftdjur":false,
        "Jordnötter":false,
        "Fisk":false,
        "Blötdjur":false,
        "Gluten":false,
        "Vegetarian":true,
        "Vegan":true,
        "Svaveldioxid":false
    }
}
