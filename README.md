# DemoAngularSlider

## Une petite démo d'implementation de slier 

J'ai pondu une petite démo d'implémentation de slider l'autre soir, parce qu'on a regardé le slider de Thibault, on a vu toute ce qui allait pas mais on a pas eu le temps d'aborder le manière de le faire comme il faut. 

Ici, le slider est fonctionnel mais est implémenté de manière un peu naive.

- support de la mousewheel
- drag and drop du trolley

Il ne supporte pas
- clavier
- click direct sur le rail
- le css est fait à l'arrache

Le scope de la démo est plus de démontrer l'approche qu'il faut avoir dans angular pour implémenter ce genre de composants de manière réutilisable et avec une approche réactive tant qu'à faire. 

le composant se situe dans `app/shared/components/slider` et est utilisé dans `app/app.component`



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
