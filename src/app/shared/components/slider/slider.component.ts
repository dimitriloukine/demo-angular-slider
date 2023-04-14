import { Component, ElementRef, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription, filter, fromEvent, merge, mergeMap, takeUntil, tap, withLatestFrom } from 'rxjs';

/* 
  le truc important ici, c'est le controll value accessor, c'est comme ça qu'on s'interface avec 
  l'api des forms d'angular.
  https://angular.io/api/forms/ControlValueAccessor
*/

@Component({
  selector: 'wy-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements OnInit, OnDestroy, ControlValueAccessor {

  counterValue:number = 0;
  private lastCounterValue:number = this.counterValue;
  position:number = 0;
  isDisabled:boolean = false;

  /* 
    le composant peut recevoir des valeurs pour min/max/spep, fonctionnellement, il fait la même chose qu'un input number,
    et on peut y assigner les valeurs par défaut directement
  */
  @Input('step') step:number = 1;
  @Input('min') min:number = 0;
  @Input('max') max:number = 100;
  @Input('height') height:number = 200;

  private range:number = this.max - this.min;
  private ratio:number = this.height / this.range; // le ratio entre la taille du slider en pixels et la range de valeurs possibles

  subscription:Subscription = new Subscription(); // voir ngOnDestroy()

  constructor(private myElement: ElementRef) {}
  /* 
    Ici, on a les méthodes liés au lifecycle du composant
    https://angular.io/guide/lifecycle-hooks
  */
  ngOnInit():void {
    this.range = this.max - this.min // les valeurs récupérées via le @Input() le sont après que le composant soit instantié
    this.ratio = this.height / this.range; // donc on doit recalculer les propriétés qui vont avec.

    this.counterValue > this.min ? this.min : this.counterValue; // des fois que min aie une valeur superieure à 0
    
    // on commence avec un truc un peu simple, scroller sur le rail ++/-- la valeur;
    // on crée un observable depuis un event de wheel sur le rail.
    const mousewheel$:Observable<WheelEvent> = fromEvent(
      this.myElement.nativeElement.getElementsByClassName("wy-slider-rail"),
      "wheel"
    );
    
    // on subscribe à l'event avec de la logique toute basique.
    this.subscription.add(
      mousewheel$.subscribe((event:WheelEvent) => {
        if(event.deltaY > 0){
          this.increment();
        }else if(event.deltaY < 0){
          this.decrement();
        }
      })
    )

    // on crée des observables pour tout ce dont on a besoin pour la partie slider
    const mousedown$ = fromEvent(
      this.myElement.nativeElement.getElementsByClassName("wy-slider-trolley"),
      "mousedown"
    ).pipe(
      tap(() => {
        this.lastCounterValue = this.counterValue; // unpure shit, cba to do it proper rn :(
        // c'est pas super élégant mais la manière de faire le truc correctement rend le code plus difficile à capter
      })
    );
    const drag$:Observable<Event> = fromEvent(document, "mousemove");
    const mouseup$:Observable<Event> = fromEvent(document, "mouseup").pipe();
    const cancel$:Observable<Event> = fromEvent(document, "keydown").pipe(
      filter((e: any) => e.code === "Escape")
    );

    // On va pas aller dans les type assertions, alors pour l'instant, le type des <Event> va être <any>
    const source$:Observable<[any, any]> = mousedown$
    .pipe(
      mergeMap(() =>
        drag$.pipe(
          takeUntil(
            merge(mouseup$, cancel$)
          )
        )
      ),
      withLatestFrom(mousedown$)
    );
    
    this.subscription.add(
      source$.subscribe(([dragEvent, mousedownEvent]:[any, any]) => {

        const offset:number = ( dragEvent.screenY - mousedownEvent.screenY );
        
        this.counterValue = this.clamp(Math.round(offset / this.ratio / this.step) * this.step + this.lastCounterValue, this.min, this.max);
        this.position = this.valueToPosition(this.counterValue)
        
        this.propagateChange(this.counterValue);
      })
    );

  };
  ngOnDestroy():void {
    /* 
      Un observable a 3 types d'events, success / error / complete, c'est pour ça que .subscribe() prend 3 callbacks
      cependant tant que l'observable n'a pas émit complete, la subscription existe même si tu détruis le composant. 
      C'est super vicieux, ça cause des memory leaks et ça fait que quand on subscribe réinstancie plusieurs fois le même composant
      on se retrouve à avoir plusieurs fois même callback de success executé pour une seule émition.
    */
    this.subscription.unsubscribe();// et comme on ajouté toutes nos subscriptions ici, on peut tout teardown d'un coup.
  }

  increment():void{
    this.counterValue = this.clamp(this.counterValue + this.step, this.min, this.max);
    this.position = this.valueToPosition(this.counterValue); 
    this.propagateChange(this.counterValue);
  }
  decrement():void {
    this.counterValue = this.clamp(this.counterValue - this.step, this.min, this.max);
    this.position = this.valueToPosition(this.counterValue); 
    this.propagateChange(this.counterValue);
  }

  valueToPosition(value:number):number {
    // convertion de la valeur en position du trolley
    return (value- this.min) * this.ratio
  }

  clamp(value:number, min:number, max:number):number {
    // je sais pas ou ça en est pour Math.clamp()
    return Math.max(
      this.min, Math.min(
        value,
        this.max
      )
    )
  }

  /* 
    A partir d'ici, c'est l'api de forms d'angular. On implémente l'interface ControlValueAccessor
    le composant peut s'interfacer avec la directive ngModel ou avec les formGroup / formControls d'angular (ce qui est la bonne manière de faire)
    https://angular.io/guide/reactive-forms
    https://angular.io/api/forms/ControlValueAccessor
   */

  // methode appelée quand on change la valeur programatiquement ou via le model, pour updater le composant
  writeValue(value: any):void {
    this.counterValue = value;
    this.position = this.valueToPosition(value);
  }
  // methode appelée quand on change la valeur dans le composant, pour updater le model
  propagateChange = (_: any) => {};

  registerOnChange(fn: (_: any) => void):void {
    this.propagateChange = fn;
  }

  propagateTouch = (_: any) => {};

  registerOnTouched(fn: (_: any) => void) {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled:boolean):void {
    //TODO
    // on s'interface avec l'api de formulaires pour disable un input ici.
  }
}
