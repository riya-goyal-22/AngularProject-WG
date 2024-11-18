import { Directive, effect, input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEditPost]',
  standalone: true
})
export class EditPostDirective {
  isUserPosts = input.required<boolean>({alias:'appEditPost'});

  constructor(
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef
  ) {
    effect(() => {
      if (this.isUserPosts()) {
        viewContainerRef
          .createEmbeddedView(templateRef);
      } else {
        viewContainerRef.clear();
      }
    })
  }



}
