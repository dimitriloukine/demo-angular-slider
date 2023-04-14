import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderComponent } from './components/slider/slider.component'; 
// import { SliderComponent } from '@wyShared/components/slider/slider.component'; 
// NOTE: @wyShared est défini dans tsconfig.json, c'est une fonctionnalité de typescript indépendante d'angular,
// ça résoud les problèmes de paths relatifs à rallonge, mais ça n'a pas l'air de marcher sur stackbitz
// https://www.typescriptlang.org/tsconfig#paths


@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SliderComponent
  ]
})
export class SharedModule { }
