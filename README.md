# DemoAngularSlider

## Une petite démo d'implementation de slider 

Un exemple de slider avec une approche appropriée à la manière dont fonctionnent angular et rxjs. 

Ici, le slider est fonctionnel mais est implémenté de manière un peu naive.
- support de la mousewheel
- drag and drop du trolley
- valeurs `min` `max` et `step` passés en attribut à au composant, de la même manière qu'à un `<input type="number">`
- support de valeurs min max négatifs
- support de step décimaux sans provoquer d'erreurs d'arrondi

Il ne supporte pas
- clavier
- touchscreen
- click direct sur le rail
- disable
- tooltip

Le scope de la démo est plus de démontrer l'approche qu'il faut avoir dans angular pour 
- implémenter ce genre de composants de manière réutilisable en utilisant l'api des forms d'angular
- avoir une approche réactive et esquiver les écueils 

Le composant se situe dans `app/shared/components/slider` et est utilisé dans `app/app.component`. Il est utilisé avec un ngModel, mais peut aussi fonctionner via un formControl. 



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
